import { CtxIdOptional, CtxId, Cb, __ } from "jsyoyo";
import { pipe, Pipe } from "composyo";
import { oYo } from "./yo";

export type Input_<X = unknown, Ctx extends CtxIdOptional = {}> = CtxId<
  Ctx,
  {
    I: (x: X) => X;
    X: X;
    o: Cb<X>;
  }
>;

export type Input<X = unknown, Ctx extends CtxIdOptional = {}> = Pipe<oYo<X, __, Input_<X, Ctx>>>;

export const input = <X, Ctx extends CtxIdOptional = {}>(x: X, ctx?: Ctx): Input<X, Ctx> =>
  pipe((o: Cb<X>) => {
    const $ = {
      I: (x) => ((($ as { X: X }).X = x), $.o(x)),
      X: x,
      o,
    } as Input_<X, Ctx>;
    $.o(x);
    return CtxId($, ctx);
  }) as never as Input<X, Ctx>;

export type Event_<X = unknown, Ctx extends CtxIdOptional = {}> = CtxId<
  Ctx,
  {
    I: (x: X) => X;
    X: X;
    o: Cb<X>;
  }
>;
export type Event<X = unknown, Ctx extends CtxIdOptional = {}> = Pipe<oYo<X, __, Event_<X, Ctx>>>;
export const event = <X, Ctx extends CtxIdOptional = {}>(ctx?: Ctx): Event<X, Ctx> =>
  pipe((o: Cb<X>) => {
    const $ = {
      I: (x) => ((($ as { X: X }).X = x), $.o(x)),
      o,
    } as Event_<X, Ctx>;
    return CtxId($, ctx);
  }) as never as Event<X, Ctx>;

event.$ =
  <X>() =>
  <Ctx extends CtxIdOptional = {}>(ctx?: Ctx) =>
    event<X, Ctx>(ctx);
