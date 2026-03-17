import { ARR } from "~types";

export type KeyValues$Object<Xs> = Xs extends readonly [[infer K, infer V], ...infer R]
  ? (K extends PropertyKey ? { [k in K]: V } : {}) & KeyValues$Object<R>
  : {};

const toObject = <X extends ARR<[PropertyKey, unknown]>>(x: X) =>
  x.reduce((a, [k, v]) => (((a as any)[k] = v), a), {} as KeyValues$Object<X>);

export { toObject };
