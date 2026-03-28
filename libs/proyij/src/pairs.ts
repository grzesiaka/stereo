import { Simplify, UnionToIntersection } from "type-fest";
import { ARR } from "~types";

export type KeyValues$Object<Xs extends ARR<[PropertyKey, unknown]>> = Simplify<
  UnionToIntersection<
    Xs[number] extends [PropertyKey, any] ? { [k in Xs[number][0]]: Extract<Xs[number], [k, any]>[1] } : {}
  >
>;

const toObject = <X extends ARR<[PropertyKey, unknown]>>(x: X) =>
  x.reduce((a, [k, v]) => (((a as any)[k] = v), a), {} as KeyValues$Object<X>);

export { toObject };
