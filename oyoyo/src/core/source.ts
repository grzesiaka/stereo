import { CtxIdOptional, __ } from "jsyoyo";
import { $Y0, Y0 } from "../base/yo";

export type Input_<X = unknown, Ctx extends CtxIdOptional = {}> = Y0<
  X,
  {
    I: (x: X) => X;
    X: X;
  },
  Ctx
>;

export type Input<X = unknown, Ctx extends CtxIdOptional = {}> = $Y0<X, Input_<X, Ctx>>;

export const input = <X, Ctx extends CtxIdOptional = {}>(x: X, ctx?: Ctx): Input<X, Ctx> =>
  Y0((o) => {
    const $ = {
      o,
      X: x,
      I: (x: X) => ((($ as { X: X }).X = x), $.o(x)),
    };
    $.o(x);
    return $;
  }, ctx) as never;

export type Event_<X = unknown, Ctx extends CtxIdOptional = {}> = Y0<
  X,
  {
    I: (x: X) => X;
  },
  Ctx
>;
export type Event<X = unknown, Ctx extends CtxIdOptional = {}> = $Y0<X, Event_<X, Ctx>>;
export const event = <X, Ctx extends CtxIdOptional = {}>(ctx?: Ctx): Event<X, Ctx> =>
  Y0(
    (o) => ({
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
