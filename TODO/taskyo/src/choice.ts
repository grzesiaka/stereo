import { __, AbortController, ARR, ARR1, CtxId$Id, CtxIdRequired } from "jsyoyo";
import { run, task, Task, Task$, Task$Params, Task$ResultOK, TaskAny } from "./task";
import { $progress, ProgressBase } from "./progress";

export type Tasks$ChoiceParams<TT> = TT extends readonly [infer T extends TaskAny, ...infer R]
  ? [T["Id"], Task$Params<T>] | Tasks$ChoiceParams<R>
  : never;

export type Tasks$ChoiceResultOK<TT> = TT extends readonly [infer T, ...infer R]
  ? Task$ResultOK<T> | Tasks$ChoiceResultOK<R>
  : never;

export type Tasks$ChoiceProgress<TT extends ARR<TaskAny>> = TT extends readonly [
  infer T extends TaskAny,
  ...infer R extends ARR<TaskAny>,
]
  ? (T["progress"][0] & { "⨁": T["Id"] } & ProgressBase) | Tasks$ChoiceProgress<R>
  : ProgressBase & { "⨁": __ };

export type Tasks$Ids<TT extends ARR<Task>> = TT[number]["Id"];

export const choice = <const TT extends ARR1<TaskAny>>(tt: TT) =>
  task({
    "⨁": __, // initially no selection; it is a runtime information; to remove it `load` CANNOT by async
  })(() => ({}), {
    __: ["⨁", tt],
  })((params, _d, abo, pu) => {
    const t = tt.find((t) => t.Id === params[0])!;
    const pr = $progress(
      {
        "⨁": params[0],
        ...t.progress[0],
      },
      t.progress[1],
    );
    let dis = () => void 0 as unknown;
    const abort = new AbortController();
    abo(() => (dis(), abort.abort()));
    const r = run(t, pr)(params[1], abort.signal);
    dis = r.progress((x) => pu(x.curr, x));
    r.finally(dis);
    return r;
  }) as <Ctx extends CtxIdRequired>(
    ctx: Ctx,
  ) => Task$<
    { __: ["⨁", TT] } & (Ctx extends string ? {} : Ctx),
    Task<CtxId$Id<Ctx>, Promise<Tasks$ChoiceResultOK<TT>>, Tasks$ChoiceParams<TT>, {}, [Tasks$ChoiceProgress<TT>]>
  >;
