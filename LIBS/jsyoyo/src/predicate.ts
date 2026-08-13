import { __ } from "./deps";
import { Tagged } from "type-fest";

export type Predicate<I = any> = (i: I) => boolean;
export type Predicates<I = any> = Record<PropertyKey, Predicate<I>>;
export type Predicates$I<Ps> = Ps extends Predicates<infer I> ? I : never;
export type Checked<Ps extends Predicates> = Ps extends Predicates<infer I> ? Tagged<I, keyof Ps> : never;

export const $predicate =
  <Ps extends Predicates, Tag extends __<PropertyKey> = __>(ps: Ps, _ = __ as Tag) =>
  <I extends Predicates$I<Ps>>(i: I): i is Tag extends PropertyKey ? Tagged<I, Tag, keyof Ps> : Checked<Ps> => {
    for (const p in ps) {
      if (!ps[p]!(i)) return false;
    }
    return true;
  };

// const p = $predicate({ minLength5: (i: string) => i.length >= 5, maxLength32: (i: string) => i.length <= 32 }, "name");
