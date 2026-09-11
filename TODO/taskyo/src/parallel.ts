import { __, ARR, CtxId$Id, CtxIdRequired, Dict, mb } from "jsyoyo";
import { task, Task, Task$, Task$Params, Task$ResultOK, TaskAny } from "./task";

import { Tasks, tasks$obj, Tasks$Obj } from "./utils";
import { ParallelTreeProgress, runTree } from "./parallel-tree";

export type Tasks$ParallelParams<TT extends Tasks> = { [K in keyof Tasks$Obj<TT>]: Task$Params<Tasks$Obj<TT>[K]> };

export type Tasks$ParallelResultOK<TT extends Tasks, E = never> = {
  [K in keyof Tasks$Obj<TT>]: Task$ResultOK<Tasks$Obj<TT>[K]> | E;
};

export const parallel = <const TT extends ARR<TaskAny>>(tt: TT) => {
  const to = tasks$obj(tt) as Dict<Task>;
  const partial = mb(() => __)(to);
  return task({
    _01: 0 as number,
    total: tt.length,
    partial,
    "⨂": __,
  } as ParallelTreeProgress<Tasks$Obj<TT>>)(() => ({}), {
    __: ["⨂", tt, to],
  })(runTree(to as never)) as <Ctx extends CtxIdRequired>(
    ctx: Ctx,
  ) => Task$<
    { __: ["⨂", TT, Tasks$Obj<TT>] } & (Ctx extends string ? {} : Ctx),
    Task<
      CtxId$Id<Ctx>,
      Promise<Tasks$ParallelResultOK<TT>>,
      Tasks$ParallelParams<TT>,
      {},
      [ParallelTreeProgress<Tasks$Obj<TT>>]
    >
  >;
};
