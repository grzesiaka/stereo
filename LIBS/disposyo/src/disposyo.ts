import { __ } from "jsyoyo";
import { ARR } from "~types";

export type Dispose = () => unknown;

export type Disposes = ARR<Dispose>;

export type Disposyo = Dispose & { __: Disposes } & ((...disposes: Disposes) => void);

// @ts-expect-error Symbol.dispose might be not present in older engines
export const DISPOSE: unique symbol = Symbol.dispose || Symbol.for("dispose");
export type DISPOSE = typeof DISPOSE;

export const disposyo = <T extends __<{}> = __>(
  D = [] as Disposes | Dispose,
  target = __ as T,
): __ extends T ? Disposyo : T & { [DISPOSE]: Disposyo } => {
  const $: Disposyo = (...ds: Disposes) =>
    (ds.length === 0 ? $.__.forEach((d) => d()) : (($.__ as never as any[]).push(...ds), $)) as never;
  $.__ = Array.isArray(D) ? D : [D];
  if (target) {
    // @ts-expect-error
    target[DISPOSE] = $;
    return target as never;
  }
  return $ as never;
};

export default disposyo;
