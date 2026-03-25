import { Simplify } from "type-fest";
import { ARR } from "~types";

export type _KeyValues$Object<Xs> = Xs extends readonly [[infer K, infer V], ...infer R]
  ? (K extends PropertyKey ? { [k in K]: V } : {}) & _KeyValues$Object<R>
  : {};

export type KeyValues$Object<Xs> = Simplify<_KeyValues$Object<Xs>>;

const toObject = <X extends ARR<[PropertyKey, unknown]>>(x: X) =>
  x.reduce((a, [k, v]) => (((a as any)[k] = v), a), {} as KeyValues$Object<X>);

export { toObject };
