import { $$, __, AbortController, ARR, ARR1 } from "jsyoyo";
import { RunState, Spec$Params, Spec$OK, Load, spec, Spec, Spec$ERR, SpecCore, SpecOptions, StateRunFn } from "./spec";
import { run, Run } from "./run";
import { Simplify } from "type-fest";
import { AwaiTreed } from "treeo";
import { percent } from "./utils";
import { sumAvgTime, WithSumAvgTime } from "./avg-time";
import { ij_Project } from "proyij";

type SpecStep<
  T extends Spec = Spec,
  Dynamic = any,
  Static = any,
  ResultPath extends __<string> = __<string>,
> = readonly [spec: T, params: SpecStepParams<T, Dynamic, Static>, result_path?: ResultPath];
type SpecStep0<T extends Spec = Spec, ResultPath extends __<string> = __<string>> = readonly [
  spec: T,
  __,
  result_path?: ResultPath,
];
type SpecStepParams<T extends Spec = Spec, Dynamic = any, Static = any> = (d: Dynamic, s: Static) => Spec$Params<T>;

type RecoveryStep<
  T extends Spec = Spec,
  Exception = any,
  Dynamic = any,
  Static = any,
  ResultPath extends __<string> = __<string>,
> = readonly [spec: T, params: RecoveryStepParams<T, Exception, Dynamic, Static>, result_path: __<ResultPath>, "_"];
type RecoveryStepParams<T extends Spec = Spec, Exception = any, Dynamic = any, Static = any> = (
  e: Exception,
  s: Static,
  d: Dynamic,
) => Spec$Params<T>;

type Step = SpecStep0 | SpecStep | RecoveryStep;
type Steps = ARR<Step>;
type Step$Path<ID extends __<string>, Path extends __<string>> = Path extends string
  ? Path
  : __ extends ID
    ? ""
    : $$<ID>;

type SpecStep$Dynamic<S> =
  S extends SpecStep<infer T, any, any, infer P>
    ? { [k in Step$Path<T["Id"], P>]: Spec$OK<T> }
    : S extends SpecStep0<infer T, infer P>
      ? { [k in Step$Path<T["Id"], P>]: Spec$OK<T> }
      : never;

type RecoveryStep$Dynamic<S> =
  S extends RecoveryStep<infer T, any, any, any, infer P> ? { [k in Step$Path<T["Id"], P>]: Spec$OK<T> } : never;

type _Steps$Dynamic<SS, ALL> = SS extends readonly [...infer R, infer S extends Step]
  ? S[3] extends "_"
    ? RecoveryStep$Dynamic<S> & Partial<_Steps$Dynamic<R, ALL>> // TODO: This could be bit more precise: the initial chunk till first Error present could be non-partial
    : SpecStep$Dynamic<S> & _Steps$Dynamic<R, ALL>
  : {};
type Steps$Dynamic<SS> = Simplify<_Steps$Dynamic<SS, SS>>;

type Steps$Errors<SS> = SS extends readonly [...infer R, infer S extends Step]
  ? S extends RecoveryStep
    ? Spec$ERR<S>
    : Spec$ERR<S[0]> | Steps$Errors<R>
  : never;

type Steps$InitParams<SS> = SS extends readonly [infer S, ...infer R]
  ? S extends SpecStep0<infer T>
    ? Spec$Params<T>
    : Steps$InitParams<R>
  : never;

interface SeqState<SS extends Steps> extends RunState {
  "%": number;
  curr: number;
  total: SS["length"];
  partial: Partial<Steps$Dynamic<SS>>;
}

class Seq<const SS extends ARR1<Step>, Deps extends Load = __> {
  constructor(
    public readonly L: Deps,
    public readonly R: SS,
  ) {}

  /**
   * Register spec
   * @param spec spec to register
   * @param params mapping from dynamic to spec params
   * @param path where result should be reported back to dynamic (defaults to spec.Id)
   * @returns
   */
  $<T extends Spec, const Re extends Spec$Params<T>, P extends __<string> = __>(
    spec: T,
    params: (R: Steps$Dynamic<SS>, L: AwaiTreed<Deps>) => Re,
    path = __ as P,
  ) {
    return new Seq(this.L, [...this.R, [spec, params, path]]);
  }

  /**
   * Register spec which does not require parameters from dynamic.
   * Ideally it should be possible via `.$` but seems impossible while respecting `const Re`,
   * which is vital to good DX.
   */
  S<T extends Spec, P extends __<string> = __>(spec: T, path = __ as P) {
    return new Seq(this.L, [...this.R, [spec, () => __, path]]);
  }

  /**
   * Recovery from error return by a previous. Error thrown are critical and not handled here.
   * @param spec spec to register
   * @param params mapping from error to spec params
   * @param path
   * @returns where result should be reported back to dynamic (defaults to spec.Id)
   */
  _<T extends Spec, const Re extends Spec$Params<T>, P extends __<string> = __>(
    spec: T,
    params: (ERR: Steps$Errors<SS>, L: AwaiTreed<Deps>, R: Partial<Steps$Dynamic<SS>>) => Re,
    path = __ as P,
  ) {
    return new Seq(this.L, [...this.R, [spec, params, path, "_"]]);
  }

  asSpec<
    Options extends SpecOptions<Steps$InitParams<SS>, Promise<Steps$Dynamic<SS> | Steps$Errors<SS>>, __> = {},
    const Id extends string = "",
  >(Id?: Id, opt?: Options) {
    return asSpec(this.L, this.R)(Id, opt);
  }
}

export const sequence = <T extends Spec, D extends Load = __, P extends __<string> = __>(
  t: T,
  d = __ as D,
  p = __ as P,
) => new Seq(d, [[t, p] as SpecStep0<T, P>]);

const runSequence =
  <SS extends Steps>(R: SS) =>
  async (p: Steps$InitParams<SS>, L: any, state: StateRunFn<any>, a: (f: () => void) => void) => {
    const abort = new AbortController();
    a(() => abort.abort());
    let i = 0;
    let err = null;
    while (i < R.length) {
      const s = R[i]!;
      if (!err && s[3] === "_") continue; // regularly skip recovery steps

      const x: Run = await run(s[0])(
        i === 0 ? p : err ? (s[1] as any)(err, L, state().partial) : (s[1] as any)(state().partial, L),
        abort.signal,
      );

      err = null;

      const _state = (re?: any) => (x: any) => {
        const t = state();
        if (re) {
          const n = t.curr + 1;
          state({
            curr: n,
            "%": n === t.total ? 100 : percent(i + 1, t.total),
            partial: {
              ...t.partial,
              [s[2] || s[0]["Id"] || ""]: re,
            },
          });
        } else {
          x.curr !== x.total && // no update in such a case - next will comes update with result
            state({
              curr: t.curr,
              "%": percent(i + x.curr / x.total, t.total),
            });
        }
      };
      const d = x.state(_state(), 1);
      const re = await x.promise;

      d();
      if (re instanceof Error) {
        while (i < R.length) {
          if (R[i]![3] !== "_") i++;
          else break;
        }
        if (i === R.length) {
          // no recovery - error reported as such
          return re;
        }
        err = re;
      } else {
        _state(re)(x.state());
        i++;
      }
    }

    return state().partial as SpecStep$Dynamic<SS>;
  };

export const asSpec = <SS extends Steps, Lo extends Load>(L: Lo, R: SS) =>
  spec.$({
    __: ["~>", R],
    get avgTime() {
      return sumAvgTime(R.map((x) => x[0]));
    },
  })(L, {
    "%": 0,
    curr: 0,
    partial: {},
    total: R.length,
  })(runSequence(R) as any) as never as <
    Options extends SpecOptions<Steps$InitParams<SS>, Promise<Steps$Dynamic<SS> | Steps$Errors<SS>>, __> = {},
    const Id extends string = "",
  >(
    Id?: Id,
    opt?: Options,
  ) => Spec<
    Id,
    SpecCore<Steps$InitParams<SS>, Promise<Steps$Dynamic<SS> | Steps$Errors<SS>>, __, SeqState<SS>, __>,
    Options & {
      __: ["~>", SS];
    } & WithSumAvgTime<ij_Project<[0], SS>>
  >;
