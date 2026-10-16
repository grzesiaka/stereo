import { CtxIdOptional, DISPOSE, MsOrNumber, __, interval as _interval } from "jsyoyo";
import { $Y0, Y0 } from "../core";

type Interval<Ms extends MsOrNumber, Ctx extends CtxIdOptional> = Y0<number, { ms: Ms; [DISPOSE]: () => void }, Ctx>;

export type Interval$<Ms extends MsOrNumber, Ctx extends CtxIdOptional> = $Y0<number, Interval<Ms, Ctx>>;

export const interval = <Ms extends MsOrNumber, Ctx extends CtxIdOptional = __>(ms: Ms, ctx = __ as Ctx) =>
  Y0((o) => {
    const $ = {
      ms,
      i: 0,
      o,
      [DISPOSE]: _interval(ms, () => $.o($.i++)),
    };
    return $;
  }, ctx) as Interval$<Ms, Ctx>;
