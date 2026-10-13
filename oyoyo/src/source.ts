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
