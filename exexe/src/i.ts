import { __, a, Cb, Dispose, Fn } from "~js";

export type StateEmitter<X = unknown, P = unknown, L = unknown, R = L> = {
  I: Cb<X> & { I: L; V: X };
  OO: Fn<[Cb<X>], P & { V: X }> & { OO: R };
};

export const emit = <X, L = __>(i: Iterable<Cb<X>>, x: X, L = __ as L) => {
  const $ = a(
    (x: X) => {
      $.V = x;
      for (const c of i) {
        c(x);
      }
    },
    { I: L, V: x },
  );
  return $;
};
export const defOO = <X, R = __>(i: Set<Cb<X>>, e: StateEmitter<X>["I"], R = __ as R) =>
  a((f: Cb<X>) => (i.add(f), () => i.delete(f)), {
    OO: R,
    get V() {
      return e.V;
    },
  });

export const $input =
  <I extends Iterable<Cb> = Set<Cb>, P = Dispose>(
    [$i, p] = [() => new Set(), defOO] as unknown as [
      () => I,
      <R>(i: I, e: StateEmitter<any>["I"], R: R) => (f: Cb) => P,
    ],
  ) =>
  <X, const L, const R = L>(x: X, ...[L, R]: [emit_context?: L, observe_context?: R]) => {
    const i = $i();
    const I = emit(i, x, L);
    return a(i, {
      I,
      OO: p(i, I, R === void 0 ? L : R),
    }) as I & StateEmitter<X, P, L, R>;
  };

export default $input;
