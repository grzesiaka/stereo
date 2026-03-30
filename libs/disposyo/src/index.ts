import { type Tree } from "treeo/types";
import forEach from "treeo/map";
import { ARR, OP } from "jsyoyo/index";
// import iA from "jsyoyo/if/if-array"; // TODO - tsdown does not emit types for the default export :/
import { ifArray } from "jsyoyo";

export type Dispose = () => void;

export type Tree_of_Disposable = Tree<Dispose | ARR<Dispose>>;

export type Disposyo<T extends Tree_of_Disposable = Tree_of_Disposable> = Dispose & { __: OP<"0", T> };

const dispose = (T: Tree_of_Disposable) =>
  forEach(T)(([v]) =>
    ifArray(
      v,
      (a) => a.forEach((c) => c()),
      (v) => v(),
    ),
  );

export const disposyo = <T extends Tree_of_Disposable = ARR<Dispose>>(T = [] as unknown as T): Disposyo<T> => {
  const $: Disposyo<T> = OP("0")(T)(() => dispose($.__[1]));
  return $;
};

export default disposyo;
