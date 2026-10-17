import { ARR } from "~types";

type __<X = never> = void | X;

export type Dispose = () => unknown;

export type Disposes = ARR<Dispose>;

export type Disposyo = Dispose & { __: Set<Dispose> } & ((...disposes: Disposes) => void);

// @ts-expect-error Symbol.dispose might be not present in older engines
export const DISPOSE: unique symbol = Symbol.dispose || Symbol.for("dispose");
export type DISPOSE = typeof DISPOSE;

export interface Disposable {
  [DISPOSE]: Dispose;
}

export const disposyo = <T extends __<{}> = __>(
  D = [] as Disposes | Dispose,
  target = void 0 as T,
): __ extends T ? Disposyo : T & { [DISPOSE]: Disposyo } => {
  const $: Disposyo = (...ds: Disposes) =>
    ds.length === 0 ? $.__.forEach((d) => d()) : ds.forEach((d) => $.__.add(d));
  $.__ = new Set(Array.isArray(D) ? D : [D]);
  if (target) {
    // @ts-expect-error
    target[DISPOSE] = $;
    return target as never;
  }
  return $ as never;
};

export default disposyo;
