import { __, a, Cb, Fn, id, ifFunction } from "jsyoyo";
import cId, { CtxIdOptional } from "jsyoyo/ctxid";
import { IO } from "./io";
import { DISPOSE, Dispose } from "disposyo";

export { DISPOSE };

type IN<I> = (I: I) => void;

export type IO_State<X> = (x?: X | undefined) => X;

export const $IO =
  <X, L extends object = {}>($x: () => X, L?: L) =>
  <I, O>(io: (OUT: Fn<[O], O>, X: (...x: [X?]) => X) => IN<I> | [IN<I>, Dispose]) =>
  <Ctx extends CtxIdOptional>(ctx?: Ctx) => {
    let i: IN<I>;
    const o = (x: O) => ($.OO.forEach((c) => c(x)), x);
    const $ = {
      OO: new Set<Cb<O>>(),
      I: (v: I) => i(v),
      X: $x(),
      O: cId((c?: Cb<O>) => (!c ? $.X : ($.OO.add(c), () => $.OO.delete(c))), ctx),
    } as IO<I, O, X, Ctx, I> & L & { OO: Set<Cb<O>>; [DISPOSE]: Dispose };
    const _id = io(o, (...x: [X?]) => (x.length && (($ as { X: any }).X = x[0]), $.X));
    ifFunction(
      _id,
      (f) => (i = f),
      ([f]) => (i = f),
    );
    $[DISPOSE] = () => {
      $.OO.clear();
      i = id;
      (_id as any)[1]?.();
    };
    return a($, L);
  };
