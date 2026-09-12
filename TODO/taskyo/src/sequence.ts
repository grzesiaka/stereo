import { __, AbortController, ARR, CtxId$Id, CtxIdRequired } from "jsyoyo";
import { Task$Params, Task$ResultOK, TaskAny, DepsC, task, run, Task$, Task } from "./task";
import { ProgressBase } from "./progress";

const deps = () => ({
  tree: { o: import("treeo") },
  ioioy: import("ioioy"),
});
const Spec = task({ units: "%", total: 100, _01: 0 as number, failed: __ as __<"abort"> }, (i) => {
  //  i._01 = _01(i.curr, i.total);
})(deps);

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
export type Step$Dynamic<S> =
  S extends RunTaskStep<infer T, any, any, infer P>
    ? { [k in Step$Path<T["Id"], P>]: Task$ResultOK<T> }
    : S extends RunTaskStep0<infer T, infer P>
      ? { [k in Step$Path<T["Id"], P>]: Task$ResultOK<T> }
      : "Step$Path";

type Steps$Dynamic<SS> = SS extends readonly [infer S, ...infer R] ? Step$Dynamic<S> & Steps$Dynamic<R> : {};

type Steps$InitParams<SS> = SS extends readonly [infer S, ...infer R]
  ? S extends RunTaskStep0<infer T>
    ? Task$Params<T>
    : Steps$InitParams<R>
  : "Steps$Path";

interface SeqProgress<SS extends Steps> extends ProgressBase {
  partial: Partial<Steps$Dynamic<SS>>;
}

export class Seq<const SS extends Steps = [], Deps extends DepsC = __> {
  constructor(
    public readonly L = () => __ as Deps,
    public readonly R = [] as Steps as SS,
  ) {}

  $<T extends TaskAny, P extends __<string> = __>(
    ...ps: SS["length"] extends 0 ? RunTaskStep0<T, P> : RunTaskStep<T, Steps$Dynamic<SS>, Deps, P>
  ) {
    return new Seq(this.L, [...this.R, ps]);
  }

  asTask<Ctx extends CtxIdRequired>(ctx: Ctx) {
    return asTask(this.L, this.R)(ctx);
  }
}

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
