import { __, AbortController, CtxId$Id, CtxIdRequired } from "jsyoyo";
import { Tree, awaiT, get, map as _map, set } from "treeo";

import { run, task, Task$Params, Task$ResultOK, TaskAny, Task, Task$, TaskRun } from "./task";
import { disposyo } from "disposyo";
import { ProgressBase, ProgressUpdate } from "./progress";
import { Simplify } from "type-fest";

export type ParallelTreeParams<TT extends Tree<TaskAny>> = TT extends { [K in string]: any }
  ? { [K in keyof TT]: TT[K] extends TaskAny ? Task$Params<TT[K]> : ParallelTreeParams<TT[K]> }
  : never;

export type ParallelTreeResults<TT extends Tree<TaskAny>, Extra = never> = TT extends { [K in string]: any }
  ? { [K in keyof TT]: TT[K] extends TaskAny ? Task$ResultOK<TT[K]> | Extra : ParallelTreeResults<TT[K]> }
  : never;

export type ParallelSubTreeProgress<TT extends Tree<TaskAny>> = TT extends { [K in string]: any }
  ? { [K in keyof TT]: TT[K] extends Task ? TaskRun<Task>["progress"] : ParallelSubTreeProgress<TT[K]> }
  : never;

export type ParallelTreeProgress<TT extends Tree<TaskAny>> = Simplify<
  ProgressBase & {
    _01: number;
    "⨂": __<ParallelSubTreeProgress<TT>>;
    partial: ParallelTreeResults<TT, __>;
  }
>;

const map = <TT extends Tree<TaskAny>>(ss: TT, f: (vk: [TaskAny, string]) => unknown) =>
  _map<TaskAny, Tree>(f as never, (i): i is object => typeof (i as any)["run"] !== "function")(ss as never);

export const runTree =
  <TT extends Tree<TaskAny>>(tt: Tree<TaskAny>) =>
  (
    p: ParallelTreeParams<TT>,
    _: unknown,
    abo: (on_abort: () => void) => void,
    u: ProgressUpdate<ParallelTreeProgress<TT>>,
  ) => {
    const dis = disposyo();
    const abort = new AbortController();
    abo(() => (dis(), abort.abort()));
    const pr = {};

    const rs = map(tt, ([t, k]) => {
      const r = run(t)(get(p)(k as never), abort.signal) as TaskRun<
        Task<any, any, any, any, [ProgressBase & { _01: number }]>
      >;
      set(k, r.progress)(pr);
      const d = r.progress(async (x: ProgressBase & { _01: number }) => {
        const subDone = x.curr === x.total ? 1 : 0;
        if (subDone) {
          await r.then((x) => (set(k, x)(u().partial), x));
          d();
        }

        const prev = x.prev || 0;
        const diff = (x.curr - prev) / x.total;
        x.prev = x.curr;
        const top = u();

        const topCurr = top.curr + subDone;

        const _01 = topCurr === top.total ? 1 : top._01 + (1 / top.total) * diff;
        _01 > top._01 &&
          u(topCurr, {
            _01: _01,
          });
      });
      dis(d);
      return r;
    });

    u(0, { "⨂": pr });
    return awaiT(rs).finally(dis) as never as Promise<ParallelTreeResults<TT>>;
  };

export const parallelTree = <TT extends Tree<TaskAny>>(tt: TT) => {
  let i = 0;
  return task({
    _01: 0 as number,
    "⨂": __ as __<ParallelSubTreeProgress<TT>>,
    partial: map(tt, () => (i++, __)) as ParallelTreeResults<TT, __>,
    total: i,
  })(() => ({}), { __: ["⨂", tt] })(runTree(tt)) as <Ctx extends CtxIdRequired>(
    ctx: Ctx,
  ) => Task$<
    { __: ["⨂", __, TT] } & (Ctx extends string ? {} : Ctx),
    Task<CtxId$Id<Ctx>, Promise<ParallelTreeResults<TT>>, ParallelTreeParams<TT>, {}, [ParallelTreeProgress<TT>]>
  >;
};
