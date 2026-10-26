import { __, Cb, Fn } from "jsyoyo";
import cId, { CtxIdOptional } from "jsyoyo/ctxid";
import { IO } from "./io";
import { DISPOSE, Dispose } from "disposyo";
import Event from "./event";

export const $IO =
  <X>($x: () => X) =>
  <I, O>(io: (OUT: Fn<[O], O>, X: (...x: [X?]) => X, IN: (cb: Cb<I>) => Dispose) => void | Dispose) =>
  <Ctx extends CtxIdOptional = __>(ctx?: CtxIdOptional) => {
    // TODO optimize - do not use Event but something lighter
    const i = Event<I>()();
    const o = (x: O) => ($.OO.forEach((c) => c(x)), x);
    const $ = {
      OO: new Set<Cb<O>>(),
      I: (v: I) => i.I(v),
      X: $x(),
      O: cId((c?: Cb<O>) => (!c ? $.X : ($.OO.add(c), () => $.OO.delete(c))), ctx),
    } as IO<I, O, X, Ctx, I> & { OO: Set<Cb<O>>; [DISPOSE]: Dispose };
    const d = io(o, (...x: [X?]) => (x.length && (($ as { X: any }).X = x[0]), $.X), i.O);
    $[DISPOSE] = () => {
      i.OO.clear();
      $.OO.clear();
      d?.();
    };
    return $;
  };
