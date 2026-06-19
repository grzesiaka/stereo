import { type TreeOrLeaves } from "treeo/types";
import forEach from "treeo/map";
import { ARR } from "~types";
import { OP } from "xpresyo";
import { ifArray, __ } from "jsyoyo";

export type Dispose = () => void;

export type Tree_of_Disposable = TreeOrLeaves<Dispose | ARR<Dispose>>;

export type Disposyo<T extends Tree_of_Disposable = Tree_of_Disposable> = Dispose & { __: OP<"0", T> };

// @ts-expect-error Symbol.dispose might be not present in older engines
export const DISPOSE: unique symbol = Symbol.dispose || Symbol.for("dispose");
export type DISPOSE = typeof DISPOSE;

const dispose = (T: Tree_of_Disposable) =>
  forEach(T)(([v]) =>
    ifArray(
      v,
      (a) => a.forEach((c) => c()),
      (v) => v(),
    ),
  );

export const disposyo = <D extends Tree_of_Disposable = ARR<Dispose>, T extends __<{}> = __>(
  D = [] as unknown as D,
  target = __ as T,
): __ extends T ? Disposyo<D> : T & { [DISPOSE]: Disposyo<D> } => {
  const $: Disposyo<D> = OP("0")(D)(() => dispose($.__[1]));
  if (target) {
    // @ts-expect-error
    target[DISPOSE] = $;
    return target as never;
  }
  return $ as never;
};

export default disposyo;
