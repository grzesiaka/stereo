import { ARR } from "~types";

export type Indexify<X, K extends PropertyKey> = X extends readonly [infer H, ...infer R]
  ? (H extends { readonly [k in K]: infer I } ? (I extends PropertyKey ? { [i in I]: H } : {}) : {}) & Indexify<R, K>
  : {};

/** Picks a name for each item. The name becomes a key the item value in a newly formed object. */
export const indexify =
  <K extends PropertyKey = "id">(k = "id" as K) =>
  <A extends ARR<object>>(a: A) =>
    a.reduce((a, x) => (k in x && ((a as any)[(x as any)[k]] = x), a), {} as Indexify<A, K>) as Indexify<A, K>;

export default indexify;
