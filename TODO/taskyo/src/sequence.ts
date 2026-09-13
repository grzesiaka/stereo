import { __, AbortController, ARR, ARR1, CtxId$Id, CtxIdRequired } from "jsyoyo";
import { Task$Params, Task$ResultOK, TaskAny, DepsC, task, run, Task$, Task, Task$Error } from "./task";
import { ProgressBase } from "./progress";
import { Simplify } from "type-fest";
import { AwaiTreed } from "treeo";

type TaskStep<
  T extends TaskAny = TaskAny,
  Dynamic = any,
  Static = any,
  ResultPath extends __<string> = __<string>,
> = readonly [task: T, params: TaskStepParams<T, Dynamic, Static>, result_path?: ResultPath];
type TaskStep0<T extends TaskAny = TaskAny, ResultPath extends __<string> = __<string>> = readonly [
  task: T,
  __,
  result_path?: ResultPath,
];
type TaskStepParams<T extends TaskAny = TaskAny, Dynamic = any, Static = any> = (
  d: Dynamic,
  s: Static,
) => Task$Params<T>;

type RecoveryStep<
  T extends TaskAny = TaskAny,
  Exception = any,
  Dynamic = any,
  Static = any,
  ResultPath extends __<string> = __<string>,
> = readonly ["_", task: T, params: RecoveryStepParams<T, Exception, Dynamic, Static>, result_path?: ResultPath];
type RecoveryStepParams<T extends TaskAny = TaskAny, Exception = any, Dynamic = any, Static = any> = (
  e: Exception,
  s: Static,
  d: Dynamic,
) => Task$Params<T>;

type Step = TaskStep0 | TaskStep | RecoveryStep;
type Steps = ARR<Step>;
type Step$Path<ID extends string, Path extends __<string>> = Path extends string ? Path : ID;

type TaskStep$Dynamic<S> =
  S extends TaskStep<infer T, any, any, infer P>
    ? { [k in Step$Path<T["Id"], P>]: Task$ResultOK<T> }
    : S extends TaskStep0<infer T, infer P>
      ? { [k in Step$Path<T["Id"], P>]: Task$ResultOK<T> }
      : never;

type RecoveryStep$Dynamic<S> =
  S extends RecoveryStep<infer T, any, any, any, infer P> ? { [k in Step$Path<T["Id"], P>]: Task$ResultOK<T> } : never;

type _Steps$Dynamic<SS, ALL> = SS extends readonly [infer S extends Step, ...infer R]
  ? S[0] extends "_"
    ? RecoveryStep$Dynamic<S>
    : TaskStep$Dynamic<S> & _Steps$Dynamic<R, ALL>
  : {};
type Steps$Dynamic<SS> = Simplify<_Steps$Dynamic<SS, SS>>;

type Steps$Errors<SS> = SS extends readonly [...infer R, infer S extends Step]
  ? S extends RecoveryStep
    ? Task$Error<S>
    : Task$Error<S> | Steps$Errors<R>
  : never;

type Steps$InitParams<SS> = SS extends readonly [infer S, ...infer R]
  ? S extends TaskStep0<infer T>
    ? Task$Params<T>
    : Steps$InitParams<R>
  : never;

interface SeqProgress<SS extends Steps> extends ProgressBase {
  partial: Partial<Steps$Dynamic<SS>>;
}

class Seq<const SS extends ARR1<Step>, Deps extends DepsC = __> {
  constructor(
    public readonly L: () => Deps,
    public readonly R: SS,
  ) {}

  $<T extends TaskAny, const Re extends Task$Params<T>, P extends __<string> = __>(
    task: T,
    params: (R: Steps$Dynamic<SS>, L: AwaiTreed<Deps>) => Re,
    path = __ as P,
  ) {
    return new Seq(this.L, [...this.R, [task, params, path]]);
  }

  _<T extends TaskAny, const Re extends Task$Params<T>, P extends __<string> = __>(
    task: T,
    params: (ERR: Steps$Errors<SS, never>, L: AwaiTreed<Deps>, R: Partial<Steps$Dynamic<SS>>) => Re,
    path = __ as P,
  ) {
    return new Seq(this.L, [...this.R, ["_", task, params, path]]);
  }

  asTask<Ctx extends CtxIdRequired>(ctx: Ctx) {
    return asTask(this.L, this.R)(ctx);
  }
}

export const sequence = <T extends TaskAny, D extends DepsC = __, P extends __<string> = __>(
  t: T,
  d = () => __ as D,
  p = __ as P,
) => new Seq(d, [[t, p] as TaskStep0<T, P>]);

export const asTask = <SS extends Steps, Deps extends DepsC>(L: () => Deps, R: SS) =>
  task({
    _01: 0,
    partial: {} as Partial<TaskStep$Dynamic<SS>>,
    total: R.length,
  })(L, { __: ["~>", R] })(async (p: Steps$InitParams<SS>, L, a, u) => {
    const abort = new AbortController();
    a(() => abort.abort());
    for (let i = 0; i < R.length; i++) {
      const s = R[i]!;
      const x = run(s[0])(i === 0 ? p : (s[1] as any)(u().partial, L), abort.signal);

      const progress = (re?: any) => (x: any) => {
        const t = u();
        if (re) {
          const n = t.curr + 1;
          u(n, {
            _01: n === t.total ? 1 : (i + 1) / t.total,
            partial: {
              ...t.partial,
              [s[2] || s[0]["Id"]]: re,
            },
          });
        } else {
          x.curr !== x.total && // no update in such a case - next will comes update with result
            u(t.curr, {
              _01: (i + x.curr / x.total) / t.total,
            });
        }
      };
      const d = x.progress(progress(), 1);
      const re = await x;
      d();
      progress(re)(x.progress());
    }

    return u().partial as TaskStep$Dynamic<SS>;
  }) as <Ctx extends CtxIdRequired>(
    ctx: Ctx,
  ) => Task$<
    { __: ["~>", SS] } & (Ctx extends string ? {} : Ctx),
    Task<CtxId$Id<Ctx>, Promise<Steps$Dynamic<SS>>, Steps$InitParams<SS>, Deps, [SeqProgress<SS>]>
  >;
