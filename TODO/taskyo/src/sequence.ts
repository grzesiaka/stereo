import { __, AbortController, ARR, ARR1, CtxId$Id, CtxIdRequired } from "jsyoyo";
import { Task$Params, Task$ResultOK, TaskAny, DepsC, task, run, Task$, Task } from "./task";
import { ProgressBase } from "./progress";
import { Simplify } from "type-fest";
import { AwaiTreed } from "treeo";

type RunTaskStep<
  T extends TaskAny = TaskAny,
  Dynamic = any,
  Static = any,
  ResultPath extends __<string> = __<string>,
> = readonly [task: T, params: StepParams<T, Dynamic, Static>, result_path?: ResultPath];

type RunTaskStep0<T extends TaskAny = TaskAny, ResultPath extends __<string> = __<string>> = readonly [
  task: T,
  __,
  result_path?: ResultPath,
];

type StepParams<T extends TaskAny = TaskAny, Dynamic = any, Static = any> = (d: Dynamic, s: Static) => Task$Params<T>;

type Step = RunTaskStep0 | RunTaskStep;

type Steps = ARR<Step>;

type Step$Path<ID extends string, Path extends __<string>> = Path extends string ? Path : ID;
type Step$Dynamic<S> =
  S extends RunTaskStep<infer T, any, any, infer P>
    ? { [k in Step$Path<T["Id"], P>]: Task$ResultOK<T> }
    : S extends RunTaskStep0<infer T, infer P>
      ? { [k in Step$Path<T["Id"], P>]: Task$ResultOK<T> }
      : "Step$Path";

type _Steps$Dynamic<SS> = SS extends readonly [infer S, ...infer R] ? Step$Dynamic<S> & _Steps$Dynamic<R> : {};
type Steps$Dynamic<SS> = Simplify<_Steps$Dynamic<SS>>;

type Steps$InitParams<SS> = SS extends readonly [infer S, ...infer R]
  ? S extends RunTaskStep0<infer T>
    ? Task$Params<T>
    : Steps$InitParams<R>
  : "Steps$Path";

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

  asTask<Ctx extends CtxIdRequired>(ctx: Ctx) {
    return asTask(this.L, this.R)(ctx);
  }
}

export const sequence = <T extends TaskAny, D extends DepsC = __, P extends __<string> = __>(
  t: T,
  d = () => __ as D,
  p = __ as P,
) => new Seq(d, [[t, p] as RunTaskStep0<T, P>]);

export const asTask = <SS extends Steps, Deps extends DepsC>(L: () => Deps, R: SS) =>
  task({
    partial: {} as Partial<Step$Dynamic<SS>>,
    total: R.length,
  })(L, { __: ["~>", R] })(async (p: Steps$InitParams<SS>, L, a, u) => {
    const abort = new AbortController();
    a(() => abort.abort());
    for (let i = 0; i < R.length; i++) {
      const s = R[i]!;
      const pe = run(s[0])(i === 0 ? p : (s[1] as any)(u().partial, L));

      const x = await pe;
      const t = u();
      u(t.curr + 1, {
        partial: {
          ...t.partial,
          [s[2] || s[0].Id]: x,
        },
      });
    }

    return u().partial as Step$Dynamic<SS>;
  }) as <Ctx extends CtxIdRequired>(
    ctx: Ctx,
  ) => Task$<
    { __: ["~>", SS] } & (Ctx extends string ? {} : Ctx),
    Task<CtxId$Id<Ctx>, Promise<Steps$Dynamic<SS>>, Steps$InitParams<SS>, Deps, [SeqProgress<SS>]>
  >;
