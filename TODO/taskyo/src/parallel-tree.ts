import { __, AbortController, CtxId$Id, CtxIdRequired } from "jsyoyo";
import { Tree, awaiT, get, map as _map, set } from "treeo";

import { run, task, Task$Params, Task$ResultOK, TaskAny, Task, Task$ } from "./task";
import { disposyo } from "disposyo";
import { ProgressSpec } from "./progress";

export type ParallelTreeParams<SS extends Tree<TaskAny>> = SS extends { [K in string]: any }
  ? { [K in keyof SS]: SS[K] extends TaskAny ? Task$Params<SS[K]> : ParallelTreeParams<SS[K]> }
  : never;

export type ParallelTreeResults<SS extends Tree<TaskAny>, Extra = never> = SS extends { [K in string]: any }
  ? { [K in keyof SS]: SS[K] extends TaskAny ? Task$ResultOK<SS[K]> | Extra : ParallelTreeResults<SS[K]> }
  : never;

const map = <SS extends Tree<TaskAny>>(ss: SS, f: (vk: [TaskAny, string]) => unknown) =>
  _map<TaskAny, Tree>(f as never, (i): i is object => typeof (i as any)["run"] !== "function")(ss as never);

export const parallelTree = <TT extends Tree<TaskAny>>(ss: TT) => {
  let i = 0;
  const partial = map(ss, () => (i++, __)) as ParallelTreeResults<TT, __>;
  return task({
    partial,
    total: i,
  })(() => ({}))<ParallelTreeParams<TT>, Promise<ParallelTreeResults<TT>>>((p, _, abo, u) => {
    const dis = disposyo();
    const abort = new AbortController();
    abo(() => (dis(), abort.abort()));
    const rs = map(ss, ([s, k]) => {
      const r = run(s)(get(p)(k as never), abort.signal);
      const d = r.progress(async (x) => {
        if (x.curr === x.total) {
          await r.then((x) => (set(k, x)(partial), x));
          const p = u();
          u(p.curr + 1, { partial });
          d();
        }
      });
      dis(d);
      return r;
    });
    u(0);
    return awaiT(rs).finally(dis) as never as Promise<ParallelTreeResults<TT>>;
  }) as <Ctx extends CtxIdRequired>(
    ctx: Ctx,
  ) => Task$<
    { __: ["⨂", TT] } & Ctx extends string ? {} : Ctx,
    Task<
      CtxId$Id<Ctx>,
      Promise<ParallelTreeResults<TT>>,
      ParallelTreeParams<TT>,
      {},
      ProgressSpec<{ total: number; curr: number; partial: ParallelTreeResults<TT, __> }>
    >
  >;
};

// export const choice = <SS extends ARR<TaskSpecAny> | Tree<TaskSpecAny>>(ss: SS) => spec();

// type Step1Params<Ctx, Params> = (ctx: Ctx) => Params;

// export type Step1<Ctx = unknown, S extends TaskSpec = TaskSpecAny> = [S, Step1Params<Ctx, Spec$Params<S>>];

// export type Step<Ctx = unknown> = Step1<Ctx> | Tree<Step1<Ctx>> | ARR<Step1<Ctx>>;

// type Steps = ARR<Step>;

// type S$R<S, Flat = false> = S extends readonly [readonly [TaskSpecAny, ...any[]], ...infer R]
//   ? S$R<S[0]> & ([] extends R ? {} : S$R<R>)
//   : S extends readonly [infer S extends TaskSpecAny, ...any[]]
//     ? true extends Flat
//       ? Spec$ResultOK<S>
//       : { [K in S["ID"]]: Spec$ResultOK<S> }
//     : S extends { [K in string]: any }
//       ? { [K in keyof S]: Simplify<S$R<S[K], true>> }
//       : never;
// export type STEP$Result<S> = Simplify<S$R<S>>;

// export type STEPS$Result<SS> = SS extends readonly [infer S extends Step, ...infer R]
//   ? STEP$Result<S> & STEPS$Result<R>
//   : __;

// export const Step =
//   <const SS extends Steps, const Spec extends TaskSpec, const S extends Step<STEPS$Result<SS>, Spec>>(s: S) =>
//   (ss: SS) =>
//     ss.concat(s as never) as [...SS, S];

// export const step0 = o([] as []);

// // const t = o([] as [])(Step([]), Step([]));

// type SPEC<ID extends string, Params = ID, Result = ID> = [TaskSpec<ID, Result, Params>, () => Params, ID];

// type A = STEP$Result<[SPEC<"A", "", "AA">, SPEC<"B">]>;

// type B = STEP$Result<{ A: { B: SPEC<"AB", 1, Promise<2>>; C: { D: [SPEC<"L">, SPEC<"R">] } } }>;
