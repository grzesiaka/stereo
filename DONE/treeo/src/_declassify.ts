import { ARR, Fn$I, Fn$O } from "jsyoyo";
import { Tree } from "./types";
import map from "./map";

type ProtoClass = new (...args: any[]) => unknown;

type Declassify<T> = T extends ProtoClass
  ? <Args extends Fn$I<T>>(...args: Args) => InstanceType<T>
  : { [K in keyof T]: Declassify<T[K]> };

export const declassify = map(
  ([v]: [ProtoClass]) =>
    (...args: ARR) =>
      new v(...args),
) as <C extends Tree<ProtoClass>>(cs: C) => Declassify<C>;
