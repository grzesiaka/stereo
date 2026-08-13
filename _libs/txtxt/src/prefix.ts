import { ij_Project } from "proyij";
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

export type GroupByPrefixAndProject<
  Key extends PropertyKey,
  Project extends PropertyKey,
  Prefixes extends ARR<string>,
  Items extends ARR,
> = { [K in keyof GroupByPrefix<Key, Prefixes, Items>]: ij_Project<[Project], GroupByPrefix<Key, Prefixes, Items>[K]> };

export const groupByPrefix =
  <
    const Key extends PropertyKey,
    Project extends __<PropertyKey> = __,
    ItemC extends { [K in Key]: string } & (Project extends PropertyKey ? { [P in Project]: unknown } : {}) = {
      [K in Key]: string;
    } & (Project extends PropertyKey ? { [P in Project]: unknown } : {}),
  >(
    key: Key,
    project = void 0 as Project,
  ) =>
  <const Prefixes extends string[]>(...ps: Prefixes) => {
    const ex = prefixExtractor(ps);
    // TODO not sure if this optimization is worth it; decide for once instead for each item;
    //      maybe better to split into seperate functions: groupByPrefix and groupByPrefixAndProject
    // TODO if needed a custom projection function could be supported
    const red = project
      ? (a: any, i: any) => {
          const p = i[key].match(ex);
          if (p) {
            (a[p[1]] = a[p[1]] || []).push(i[project]); // <--- project to key
          }
          return a;
        }
      : (a: any, i: any) => {
          const p = i[key].match(ex);
          if (p) {
            (a[p[1]] = a[p[1]] || []).push(i); // <--- id / no-project
          }
          return a;
        };
    return <const Items extends ARR<ItemC>>(items: Items) =>
      items.reduce(red, {}) as Project extends PropertyKey
        ? GroupByPrefixAndProject<Key, Project, Prefixes, Items>
        : GroupByPrefix<Key, Prefixes, Items>;
  };

export const groupByPrefixKV = groupByPrefix<0, 1>(0, 1);
