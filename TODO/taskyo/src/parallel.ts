import { Simplify } from "type-fest";
import { __, ARR, CtxId$Id, CtxIdRequired, Dict, mb } from "jsyoyo";
import { task, Task, Task$, Task$Params, Task$ResultOK, TaskAny } from "./task";
import { ProgressBase } from "./progress";

import { Tasks, tasks$obj, Tasks$Obj } from "./utils";
import { runTree } from "./parallel-tree";

export type Tasks$ParallelParams<TT extends Tasks> = { [K in keyof Tasks$Obj<TT>]: Task$Params<Tasks$Obj<TT>[K]> };

export type Tasks$ParallelResultOK<TT extends Tasks, E = never> = {
  [K in keyof Tasks$Obj<TT>]: Task$ResultOK<Tasks$Obj<TT>[K]> | E;
};

export type Tasks$ParallelProgress<TT extends ARR<TaskAny>> = Simplify<
  ProgressBase & {
    _01: number;
    partial: Tasks$ParallelResultOK<TT, __>;
    "⨂": {
      [K in keyof Tasks$Obj<TT>]: Tasks$Obj<TT>[K] extends TaskAny ? Tasks$Obj<TT>[K]["progress"][0] : never;
    };
  }
>;

export const parallel = <const TT extends ARR<TaskAny>>(tt: TT) => {
  const to = tasks$obj(tt) as Dict<Task>;
  const partial = mb(() => __)(to);
  return task({
    _01: 0 as number,
    total: tt.length,
    partial,
    "⨂": mb<Dict<Task>>((t) => t.progress[0])(to),
  })(() => ({}), {
    __: ["⨂", tt, to],
  })(runTree(to as never, partial as never)) as <Ctx extends CtxIdRequired>(
    ctx: Ctx,
  ) => Task$<
    { __: ["⨂", TT] } & (Ctx extends string ? {} : Ctx),
    Task<CtxId$Id<Ctx>, Promise<Tasks$ParallelResultOK<TT>>, Tasks$ParallelParams<TT>, {}, [Tasks$ParallelProgress<TT>]>
  >;
};
