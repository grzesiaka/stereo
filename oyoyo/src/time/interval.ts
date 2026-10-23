import { CtxIdOptional, DISPOSE, MsOrNumber, __, interval as _interval, a } from "jsyoyo";
import { $Y0, Y0 } from "../base";

type Interval<Ms extends MsOrNumber, Ctx extends CtxIdOptional> = Y0<
  number,
  { __: ["interval", Ms]; i: number; [DISPOSE]: () => void },
  Ctx
>;

export type Interval$<Ms extends MsOrNumber, Ctx extends CtxIdOptional> = $Y0<number, Interval<Ms, Ctx>>;

export const interval = <Ms extends MsOrNumber, Ctx extends CtxIdOptional = __>(ms: Ms, ctx = __ as Ctx) =>
  Y0(($) => {
    a($, {
      __: ["interval", ms],
      i: 0,
    }) as Interval<Ms, Ctx>;
    return _interval(ms, () => $.o(($ as any).i++));
  }, ctx) as Interval$<Ms, Ctx>;
