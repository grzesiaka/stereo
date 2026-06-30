import { es, mb } from "jsyoyo";
import Var from "./var";

export type FromObject<X extends object, AsObject extends boolean | 0 | 1 = 0> = AsObject extends 1 | true
  ? { [K in keyof X]: Var<K, X[K]> }
  : { [K in keyof X]: Var<K, X[K]> }[keyof X][];

export const fromObject = <const X extends object, AsObject extends boolean | 0 | 1 = 0>(x: X, asObject?: AsObject) =>
  (asObject ? mb((v, k) => Var(v, k))(x) : es(x).map(([k, v]) => Var(v, k))) as FromObject<X, AsObject>;
