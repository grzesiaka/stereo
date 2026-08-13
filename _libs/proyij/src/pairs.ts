import { ARR } from "~types";

export type KeyValues$Object<Xs extends ARR<readonly [any, any]>> =
  Extract<Xs[number], readonly [PropertyKey, any]> extends any
    ? { [k in Extract<Xs[number], readonly [PropertyKey, any]>[0]]: Extract<Xs[number], [k, any]>[1] }
    : Xs[number];

const toObject = <X extends ARR<[PropertyKey, unknown]>>(x: X) =>
  x.reduce((a, [k, v]) => (((a as any)[k] = v), a), {} as KeyValues$Object<X>);

export { toObject };
