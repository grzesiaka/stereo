import { __, AbortController, CtxId$Id, CtxIdRequired } from "jsyoyo";
import { Tree, awaiT, get, map as _map, set } from "treeo";

import { run, task, Task$Params, Task$ResultOK, TaskAny, Task, Task$, TaskRun } from "./task";
import { disposyo } from "disposyo";
import { ProgressBase, ProgressSpec, ProgressUpdate } from "./progress";

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
  (
    p: ParallelTreeParams<TT>,
    _: unknown,
    abo: (on_abort: () => void) => void,
    u: ProgressUpdate<ProgressBase & { _01: number }>,
  ) => {
    const dis = disposyo();
    const abort = new AbortController();
    abo(() => (dis(), abort.abort()));
    const rs = map(tt, ([t, k]) => {
      const r = run(t)(get(p)(k as never), abort.signal) as TaskRun<
        Task<any, any, any, any, [ProgressBase & { _01: number }]>
      >;
      const d = r.progress(async (x: ProgressBase & { _01: number }) => {
        const subDone = x.curr === x.total ? 1 : 0;
        if (subDone) {
          // console.log("---> DONE", t.Id, x.curr);
          await r.then((x) => (set(k, x)(partial), x));
          d();
        }

        const prev = x.prev || 0;
        const diff = (x.curr - prev) / x.total;
        x.prev = x.curr;
        const top = u();

        const topCurr = top.curr + subDone;

        // this due to rounding errors does not guarantee to hit perfect 1 at the end
        const _01 = topCurr === top.total ? 1 : top._01 + (1 / top.total) * diff;
        _01 > top._01 &&
          u(topCurr, {
            _01: _01,
          });

        // console.log("END", t.Id, _01);
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
    _01: 0 as number,
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
      ProgressSpec<{ _01: number; total: number; curr: number; partial: ParallelTreeResults<TT, __> }>
    >
  >;
};
