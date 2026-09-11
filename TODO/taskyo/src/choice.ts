import { __, AbortController, ARR, ARR1, CtxId$Id, CtxIdRequired } from "jsyoyo";
import { run, task, Task, Task$, Task$Params, Task$ResultOK, TaskAny } from "./task";
import { disposyo } from "disposyo";
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
  ? (T["progress"][0] & { "⨁": T["Id"] }) | Tasks$ChoiceProgress<R>
  : ProgressBase & { "⨁": __ };

export type Tasks$Ids<TT extends ARR<Task>> = TT[number]["Id"];

export const choice = <const TT extends ARR1<TaskAny>>(tt: TT) =>
  task<Tasks$ChoiceProgress<TT>>({
    "⨁": __,
  } as never)(() => ({
    "⨁": __,
  }))<Tasks$ChoiceParams<TT>, Promise<Task$ResultOK<TT>>>((params, _d, abo, pu) => {
    const t = tt.find((t) => t.Id === params[0])!;
    const pr = $progress(
      {
        "⨁": params[0],
        ...t.progress[0],
      },
      t.progress[1],
    );
    const dis = disposyo();
    const abort = new AbortController();
    abo(() => (dis(), abort.abort()));
    const r = run(t, pr)(params[1], abort.signal);
    const up = (x: any) => {
      pu(x.curr, x);
    };
    r.progress(up, 1);
    return r;
  }) as <Ctx extends CtxIdRequired>(
    ctx: Ctx,
  ) => Task$<
    { __: ["⨁", TT] } & Ctx extends string ? {} : Ctx,
    Task<CtxId$Id<Ctx>, Promise<Tasks$ChoiceResultOK<TT>>, Tasks$ChoiceParams<TT>, {}, [Tasks$ChoiceProgress<TT>]>
  >;
