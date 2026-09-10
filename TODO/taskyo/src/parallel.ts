import { __, AbortController } from "jsyoyo";
import { Tree, awaiT, get, map as _map, set } from "treeo";

import { run, spec, Spec$Params, Spec$ResultOK, TaskSpec, TaskSpecAny } from "./task";
import { disposyo } from "disposyo";
import { ProgressBase } from "./progress";

export type ParallelParams<SS extends Tree<TaskSpecAny>> = SS extends { [K in string]: any }
  ? { [K in keyof SS]: SS[K] extends TaskSpecAny ? Spec$Params<SS[K]> : ParallelParams<SS[K]> }
  : never;

export type ParallelResults<SS extends Tree<TaskSpecAny>, Extra = never> = SS extends { [K in string]: any }
  ? { [K in keyof SS]: SS[K] extends TaskSpecAny ? Spec$ResultOK<SS[K]> | Extra : ParallelResults<SS[K]> }
  : never;

const map = <SS extends Tree<TaskSpec>>(ss: SS, f: (vk: [TaskSpec, string]) => unknown) =>
  _map<TaskSpec, Tree>(f as never, (i): i is object => typeof (i as any)["run"] !== "function")(ss as never);

export const parallel = <const ID extends string, SS extends Tree<TaskSpecAny>>(ID: ID, ss: SS) => {
  let i = 0;
  const partial = map(ss, () => (i++, __)) as ParallelResults<SS, __>;
  return spec({
    partial,
    total: i,
  })(() => ({}))<ParallelParams<SS>, Promise<ParallelResults<SS>>>((p, _, abo, u) => {
    const dis = disposyo();
    const abort = new AbortController();
    abo(() => (dis(), abort.abort()));
    const rs = map(ss, ([s, k]) => {
      const r = run(s)(get(p)(k as never), abort.signal);
      const d = r.progress(async (x: ProgressBase) => {
        if (x.curr === x.total) {
          await r.then((x) => (set(k, x)(partial), x));
          const p = u();
          u(p.curr + 1, { partial });
          d();
        }
      });
      dis.__.push(d);
      return r;
    });
    u(0);
    return awaiT(rs).finally(dis) as never as Promise<ParallelResults<SS>>;
  })(ID) as never as TaskSpec<
    ID,
    Promise<ParallelResults<SS>>,
    ParallelParams<SS>,
    {},
    [
      { total: number; curr: number; partial: ParallelResults<SS, __> },
      () => { total: number; curr: number; partial: ParallelResults<SS, __> },
    ]
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
