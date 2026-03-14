import { __, a, Cb, Dispose, Fn } from "~js";

export type EventEmitter<X = unknown, P = unknown, L = unknown, R = L> = {
  I: Cb<X> & { I: L };
  OO: Fn<[Cb<X>], P> & { OO: R };
};

export const emit = <X, L = __>(i: Iterable<Cb<X>>, L = __ as L) =>
  a(
    (x: X) => {
      for (const c of i) {
        c(x);
      }
    },
    { I: L },
  );
export const defOO = <X, R = __>(i: Set<Cb<X>>, R = __ as R) =>
  a((f: Cb<X>) => (i.add(f), () => i.delete(f)), { OO: R });

export const $event =
  <X, I extends Iterable<Cb<X>> = Set<Cb<X>>, P = Dispose>(
    [$i, p] = [() => new Set(), defOO] as unknown as [() => I, <R>(i: I, R: R) => (f: Cb<X>) => P],
  ) =>
  <const L, const R = L>(...[L, R]: [L?, R?]) => {
    const i = $i();
    return a(i, {
      I: emit(i, L),
      OO: p(i, R === void 0 ? L : R),
    }) as I & EventEmitter<X, P, L, R>;
  };

export default $event;
