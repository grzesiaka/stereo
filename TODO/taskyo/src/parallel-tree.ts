import { __, AbortController, CtxId$Id, CtxIdRequired } from "jsyoyo";
import { Tree, awaiT, get, map as _map, set } from "treeo";

import { run, task, Task$Params, Task$ResultOK, TaskAny, Task, Task$ } from "./task";
import { disposyo } from "disposyo";
import { ProgressSpec, ProgressUpdate } from "./progress";

export type ParallelTreeParams<SS extends Tree<TaskAny>> = SS extends { [K in string]: any }
  ? { [K in keyof SS]: SS[K] extends TaskAny ? Task$Params<SS[K]> : ParallelTreeParams<SS[K]> }
  : never;

export type ParallelTreeResults<SS extends Tree<TaskAny>, Extra = never> = SS extends { [K in string]: any }
  ? { [K in keyof SS]: SS[K] extends TaskAny ? Task$ResultOK<SS[K]> | Extra : ParallelTreeResults<SS[K]> }
  : never;

const map = <SS extends Tree<TaskAny>>(ss: SS, f: (vk: [TaskAny, string]) => unknown) =>
  _map<TaskAny, Tree>(f as never, (i): i is object => typeof (i as any)["run"] !== "function")(ss as never);

export const runTree =
  <TT extends Tree<TaskAny>>(tt: Tree<TaskAny>, partial: ParallelTreeResults<TT, __>) =>
  (p: ParallelTreeParams<TT>, _: unknown, abo: (on_abort: () => void) => void, u: ProgressUpdate<any>) => {
    const dis = disposyo();
    const abort = new AbortController();
    abo(() => (dis(), abort.abort()));
    const rs = map(tt, ([s, k]) => {
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
  };

export const parallelTree = <TT extends Tree<TaskAny>>(tt: TT) => {
  let i = 0;
  const partial = map(tt, () => (i++, __)) as ParallelTreeResults<TT, __>;
  return task({
    partial,
    total: i,
  })(() => ({}), { __: ["⨂*", tt] })(runTree(tt, partial)) as <Ctx extends CtxIdRequired>(
    ctx: Ctx,
  ) => Task$<
    { __: ["⨂*", TT] } & Ctx extends string ? {} : Ctx,
    Task<
      CtxId$Id<Ctx>,
      Promise<ParallelTreeResults<TT>>,
      ParallelTreeParams<TT>,
      {},
      ProgressSpec<{ total: number; curr: number; partial: ParallelTreeResults<TT, __> }>
    >
  >;
};
