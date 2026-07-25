import { KeyValues$Object } from "proyij";
import { __, ARR } from "~types";

export const prefixExtractor = <const Prefixes extends string[]>(ps: Prefixes) =>
  new RegExp(
    `^(${ps
      // .sort((a, b) => b.length - a.length)
      .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`,
  );

export type ExtractPrefix<Prefixes extends ARR<string>, S extends string> = Prefixes extends readonly [
  infer P extends string,
  ...infer R extends ARR<string>,
]
  ? S extends P | `${P}${string}`
    ? P
    : ExtractPrefix<R, S>
  : __;

export const extractPrefix = <const Prefixes extends string[]>(...ps: Prefixes) => {
  const extractor = prefixExtractor(ps);
  return <const S extends string>(s: S) => s.match(extractor)?.[1] as ExtractPrefix<Prefixes, S>;
};

export type ToPrefix<Key extends PropertyKey, Prefixes extends ARR<string>, Item> = Item extends {
  readonly [K in Key]: string;
}
  ? ExtractPrefix<Prefixes, Item[Key]>
  : __;

export type PrePrefix<
  Key extends PropertyKey,
  Prefixes extends ARR<string>,
  Items extends ARR,
> = Items extends readonly [infer H, ...infer R]
  ? __ extends ToPrefix<Key, Prefixes, H>
    ? PrePrefix<Key, Prefixes, R>
    : [[ToPrefix<Key, Prefixes, H>, H], ...PrePrefix<Key, Prefixes, R>]
  : [Items];

export type GroupByPrefix<Key extends PropertyKey, Prefixes extends ARR<string>, Items extends ARR> = KeyValues$Object<
  PrePrefix<Key, Prefixes, Items>
>;

export const groupByPrefix =
  <const Key extends PropertyKey>(key: Key) =>
  <const Prefixes extends string[]>(...ps: Prefixes) => {
    const ex = prefixExtractor(ps);
    return <const Items extends ARR<{ [K in Key]: string }>>(items: Items) =>
      items.reduce((a, i) => {
        const p = i[key].match(ex);
        if (p) {
          // @ts-expect-error
          const r = (a[p[1]] = a[p[1]] || []);
          r.push(i);
        }
        return a;
      }, {}) as GroupByPrefix<Key, Prefixes, Items>;
  };
