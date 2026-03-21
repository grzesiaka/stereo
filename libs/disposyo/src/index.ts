import { type Tree } from "treeo/types";
import forEach from "treeo/map";
import { ARR, OP } from "~js";

export type Dispose = () => void;

type DisposeOrArrayOfDispose = Dispose | ARR<Dispose>;

export type Tree_of_Disposable = Tree<DisposeOrArrayOfDispose>;

export type Disposyo<T extends Tree_of_Disposable = Tree_of_Disposable> = Dispose & { __: OP<"0", T> };

const dispose = (T: Tree_of_Disposable) =>
  forEach(T)(([v]) => (Array.isArray(v) ? v.forEach((d) => d()) : (v as Dispose)())); // TODO: mapTree types are bit of

export const disposyo = <T extends Tree_of_Disposable = ARR<Dispose>>(T = [] as unknown as T): Disposyo<T> => {
  const $: Disposyo<T> = OP("0")(T)(() => dispose($.__[1]));
  return $;
};

export default disposyo;
