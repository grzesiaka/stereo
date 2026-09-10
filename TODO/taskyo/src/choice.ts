import { AbortController, ARR, ARR1, CtxId$Id, CtxIdRequired, Fn$O } from "jsyoyo";
import { $run, run, task, Task, Task$, Task$Params, Task$ResultOK, TaskAny } from "./task";
import { disposyo } from "disposyo";
import { ProgressBase, ProgressInfo } from "./progress";

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
  ? [{}, () => T["progress"][0] & { $selected: T["Id"] }] | Tasks$ChoiceProgress<R>
  : never;

export type Tasks$Ids<TT extends ARR<Task>> = TT[number]["Id"];

export const choice = <const TT extends ARR1<TaskAny>>(tt: TT) =>
  task<Tasks$ChoiceProgress<TT>[0], Tasks$ChoiceProgress<TT>[1]>()(() => ({}))<
    Tasks$ChoiceParams<TT>,
    Promise<Task$ResultOK<TT>>
  >((p, _d, abo, pu) => {
    const t = tt.find((t) => t.Id === p[0])!;
    pu(0, t.progress[0]);
    const dis = disposyo();
    const abort = new AbortController();
    abo(() => (dis(), abort.abort()));
    const [r, vr, pro] = $run(t)(p[1], abort.signal);
    console.log("--CHOICE 1-->", pro());
    const up = (x: any) => {
      console.log("---> CHOICE 1.5 -->", x, p[0]);
      pu(0, { ...x, $selected: p[0] });
      console.log("---> CHOICE 2 -->", x, p[0]);
    };
    vr.O(up);
    up(pro());
    r.progress = vr.O;
    return r;
  }) as <Ctx extends CtxIdRequired>(
    ctx: Ctx,
  ) => Task$<
    { __: ["⨁", TT] } & Ctx extends string ? {} : Ctx,
    Task<CtxId$Id<Ctx>, Promise<Tasks$ChoiceResultOK<TT>>, Tasks$ChoiceParams<TT>, {}, Tasks$ChoiceProgress<TT>>
  >;
