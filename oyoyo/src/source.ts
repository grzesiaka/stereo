import { CtxIdOptional, CtxId, Cb, __ } from "jsyoyo";
import { pipe, Pipe } from "composyo";
import { yo } from "./yo";

export type Input_<X = unknown, Ctx extends CtxIdOptional = {}> = CtxId<
  Ctx,
  {
    I: (x: X) => X;
    X: X;
    y: Cb<X>;
  }
>;

export type Input<X = unknown, Ctx extends CtxIdOptional = {}> = Pipe<yo<X, __, Input_<X, Ctx>>>;

export const input = <X, Ctx extends CtxIdOptional = {}>(x: X, ctx?: Ctx): Input<X, Ctx> =>
  pipe((y: Cb<X>) => {
    const $ = {
      I: (x) => ((($ as { X: X }).X = x), $.y(x)),
      X: x,
      y,
    } as Input_<X, Ctx>;
    $.y(x);
    return CtxId($, ctx);
  }) as never as Input<X, Ctx>;

export type Event_<X = unknown, Ctx extends CtxIdOptional = {}> = CtxId<
  Ctx,
  {
    I: (x: X) => X;
    X: X;
    y: Cb<X>;
  }
>;

export type Event<X = unknown, Ctx extends CtxIdOptional = {}> = Pipe<yo<X, __, Event_<X, Ctx>>>;

export const event = <X, Ctx extends CtxIdOptional = {}>(ctx?: Ctx): Event<X, Ctx> =>
  pipe((y: Cb<X>) => {
    const $ = {
      I: (x) => ((($ as { X: X }).X = x), $.y(x)),
      y,
    } as Event_<X, Ctx>;
    return CtxId($, ctx);
  }) as never as Event<X, Ctx>;

event.$ =
  <X>() =>
  <Ctx extends CtxIdOptional = {}>(ctx?: Ctx) =>
    event<X, Ctx>(ctx);
