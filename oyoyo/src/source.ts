import { CtxIdOptional, CtxId, Cb, __ } from "jsyoyo";
import { pipe, Pipe } from "composyo";

export type Input_<X = unknown, Ctx extends CtxIdOptional = {}> = CtxId<
  Ctx,
  {
    I: (x: X) => X;
    X: X;
    o: Cb<X>;
  }
>;

export type Input<X = unknown, Ctx extends CtxIdOptional = {}> = Pipe<(o: Cb<X>) => Input_<X, Ctx>>;

export const input = <X, Ctx extends CtxIdOptional = {}>(x: X, ctx?: Ctx): Input<X, Ctx> =>
  pipe((o: Cb<X>) => {
    const $ = {
      I: (x) => ((($ as { X: X }).X = x), $.o(x)),
      X: x,
      o,
    } as Input_<X, Ctx>;
    $.o(x);
    return CtxId($, ctx);
  });
