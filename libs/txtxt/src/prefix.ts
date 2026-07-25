import { __, ARR } from "~types";

export const prefixExtractor = <const Prefixes extends string[]>(ps: Prefixes) =>
  new RegExp(
    `^(${ps
      // automatic sorting does not play nicely with Typescript; Type level sorting would be most likely needed
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

export type ToPrefix<
  Key extends PropertyKey,
  Prefixes extends ARR<string>,
  CurrentPrefix extends string,
  Item,
> = Item extends {
  readonly [K in Key]: string;
}
  ? CurrentPrefix extends ExtractPrefix<Prefixes, Item[Key]>
    ? CurrentPrefix
    : __
  : __;

export type WithPrefix<
  Key extends PropertyKey,
  Prefixes extends ARR<string>,
  CurrentPrefix extends string, // this is needed to resolve overlapping prefixes
  Items extends ARR,
> = Items extends readonly [infer H, ...infer R]
  ? __ extends ToPrefix<Key, Prefixes, CurrentPrefix, H>
    ? WithPrefix<Key, Prefixes, CurrentPrefix, R>
    : [H, ...WithPrefix<Key, Prefixes, CurrentPrefix, R>]
  : Items extends readonly []
    ? []
    : Items extends ReadonlyArray<infer I>
      ? Array<ToPrefix<Key, Prefixes, CurrentPrefix, I>>
      : never;

export type GroupByPrefix<Key extends PropertyKey, Prefixes extends ARR<string>, Items extends ARR> = {
  [K in Prefixes[number] as WithPrefix<Key, Prefixes, K, Items> extends [] ? never : K]: WithPrefix<
    Key,
    Prefixes,
    K,
    Items
  >;
};

export const groupByPrefix =
  <const Key extends PropertyKey>(key: Key) =>
  <const Prefixes extends string[]>(...ps: Prefixes) => {
    const ex = prefixExtractor(ps);
    return <const Items extends ARR<{ [K in Key]: string }>>(items: Items) =>
      items.reduce((a, i) => {
        const p = i[key].match(ex);
        if (p) {
          // @ts-expect-error
          (a[p[1]] = a[p[1]] || []).push(i);
        }
        return a;
      }, {}) as GroupByPrefix<Key, Prefixes, Items>;
  };
