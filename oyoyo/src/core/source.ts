import { CtxIdOptional, __, a, id } from "jsyoyo";
import { $Y0, makeCompletable, Y0 } from "../base/yo";

export type Never<X = never, Ctx extends CtxIdOptional = {}> = Y0<X, { __: ["never", X?] }, Ctx>;
export type Never$<X = never, Ctx extends CtxIdOptional = {}> = $Y0<X, Never<X, Ctx>>;
export const never = <Ctx extends CtxIdOptional = {}, X = never>(ctx?: Ctx) =>
  Y0(($) => {
    $.__ = ["never"];
  }, ctx) as Never$<X, Ctx>;

export type Input<X = unknown, Ctx extends CtxIdOptional = {}> = Y0<
  X,
  {
    __: ["input", X];
    I: (x: X) => X;
    X: X;
  },
  Ctx
>;

export type Input$<X = unknown, Ctx extends CtxIdOptional = {}> = $Y0<X, Input<X, Ctx>>;

export const input = <X, Ctx extends CtxIdOptional = {}>(x: X, ctx?: Ctx): Input$<X, Ctx> =>
  Y0(($) => {
    a($, {
      __: ["input", x],
      X: x,
      I: (x: X) => ((($ as any as { X: X }).X = x), $.o(x)),
    });
    $.o(x);
    return () => ($.o = id);
  }, ctx) as never;

export type Event<X = unknown, Ctx extends CtxIdOptional = {}> = Y0<X, { __: ["event"]; I: (x: X) => X }, Ctx>;
export type Event$<X = unknown, Ctx extends CtxIdOptional = {}> = $Y0<X, Event<X, Ctx>>;
export const event = <X, Ctx extends CtxIdOptional = {}>(ctx?: Ctx): Event$<X, Ctx> =>
  Y0(($) => {
    a($, {
      __: ["event"],
      I: (x: X) => $.o(x),
    });
    return () => ($.o = id);
  }, ctx) as never;

event.$ =
  <X>() =>
  <Ctx extends CtxIdOptional = {}>(ctx?: Ctx) =>
    event<X, Ctx>(ctx);

export type Val<X = unknown, Ctx extends CtxIdOptional = {}> = Y0<X, { __: ["val", X]; "#": 1 }, Ctx>;
export type Val$<X = unknown, Ctx extends CtxIdOptional = {}> = $Y0<X, Val<X, Ctx>>;
export const val = <X = unknown, Ctx extends CtxIdOptional = {}>(x: X, ctx?: Ctx) =>
  Y0(($) => {
    a($, {
      "#": 1,
      __: ["val", x] as ["val", X],
    });
    const [complete] = makeCompletable($);
    $.o(x);
    complete(1);
  }, ctx) as never as Val$<X, Ctx>;

export type OnceEvent<X = unknown, Ctx extends CtxIdOptional = {}> = Y0<
  X,
  { __: ["once"]; X?: X; I: (x: X) => __<X>; "#": 1 },
  Ctx
>;
export type OnceEvent$<X = unknown, Ctx extends CtxIdOptional = {}> = $Y0<X, OnceEvent<X, Ctx>>;
export const once = <X, Ctx extends CtxIdOptional = {}>(ctx?: Ctx): OnceEvent$<X, Ctx> =>
  Y0(($) => {
    a($, {
      __: ["once"] as ["once"],
      "#": 1,
      I: (x: X): X => ((($ as any).X = x), (($ as any).I = id), $.o(x), complete(1), x),
    });
    const [complete] = makeCompletable($);
    return () => ($.o = id);
  }, ctx) as never;
once.$ =
  <X>() =>
  <Ctx extends CtxIdOptional = {}>(ctx?: Ctx) =>
    once<X, Ctx>(ctx);
