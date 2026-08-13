import { Arryo, Arryo$X } from "./types";

// TODO: finish if needed, but arryo as such feels bit too wild: entries should be constained

const _reduce =
  (p?: any) =>
  <R, A extends Arryo, I = {}, X = Arryo$X<A>>(
    $: (current: X, acc: NoInfer<I>, parent?: Arryo<X>) => R,
    init = (() => ({})) as I | (() => I),
    i = typeof init === "function" ? (init as () => any)() : init,
  ) =>
  (a: A) => {
    if (Array.isArray(a)) {
      a.forEach(_reduce(a)($, i));
    } else {
      $(a as never as X, i, p);
    }
    return i;
  };

const reduce = _reduce();

export default reduce;
