import { CtxIdOptional, __, id } from "jsyoyo";
import { $Y0, makeCompletable, Y0 } from "../base/yo";

export type Never<X = never, Ctx extends CtxIdOptional = {}> = Y0<X, { __: ["never", X?] }, Ctx>;
export type Never$<X = never, Ctx extends CtxIdOptional = {}> = $Y0<X, Never<X, Ctx>>;
export const never = <Ctx extends CtxIdOptional = {}, X = never>(ctx?: Ctx) =>
  Y0(() => {
    const $ = {
      __: ["never"],
    };
    return $;
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
  Y0((o) => {
    const $ = {
      __: ["input", x],
      o,
      X: x,
      I: (x: X) => ((($ as { X: X }).X = x), $.o(x)),
    };
    $.o(x);
    return $;
  }, ctx) as never;

export type Event<X = unknown, Ctx extends CtxIdOptional = {}> = Y0<X, { __: ["event"]; I: (x: X) => X }, Ctx>;
export type Event$<X = unknown, Ctx extends CtxIdOptional = {}> = $Y0<X, Event<X, Ctx>>;
export const event = <X, Ctx extends CtxIdOptional = {}>(ctx?: Ctx): Event$<X, Ctx> =>
  Y0(
    (o) => ({
      __: ["event"],
      o,
      get I() {
        return this.o;
      },
    }),
    ctx,
  ) as never;

event.$ =
  <X>() =>
  <Ctx extends CtxIdOptional = {}>(ctx?: Ctx) =>
    event<X, Ctx>(ctx);

export type Val<X = unknown, Ctx extends CtxIdOptional = {}> = Y0<X, { __: ["val", X]; "#": 1 }, Ctx>;
export type Val$<X = unknown, Ctx extends CtxIdOptional = {}> = $Y0<X, Val<X, Ctx>>;
export const val = <X = unknown, Ctx extends CtxIdOptional = {}>(x: X, ctx?: Ctx) =>
  Y0((o) => {
    const $ = {
      o,
      __: ["val", x],
    };
    const [complete] = makeCompletable($);
    $.o(x);
    complete(1);
    return $;
  }, ctx) as Val$<X, Ctx>;

export type OnceEvent<X = unknown, Ctx extends CtxIdOptional = {}> = Y0<
  X,
  { __: ["once"]; X?: X; I: (x: X) => __<X>; "#": 1 },
  Ctx
>;
export type OnceEvent$<X = unknown, Ctx extends CtxIdOptional = {}> = $Y0<X, OnceEvent<X, Ctx>>;
export const once = <X, Ctx extends CtxIdOptional = {}>(ctx?: Ctx): OnceEvent$<X, Ctx> =>
  Y0((o) => {
    const $ = {
      __: ["once"],
      "#": 1,
      o,
      I: (x: X): X => ((($ as any).X = x), ($.I = id), complete(1), $.o(x), x),
    };
    const [complete] = makeCompletable($);
    return $;
  }, ctx) as never;
once.$ =
  <X>() =>
  <Ctx extends CtxIdOptional = {}>(ctx?: Ctx) =>
    once<X, Ctx>(ctx);
