import { Tagged as TF_Tagged, UnwrapTagged, GetTagMetadata as TF_GetTagMetadata } from "type-fest";
export * from "./type-fest";

export type Tagged<T = unknown, TagName extends PropertyKey = PropertyKey, Meta = any> = TF_Tagged<T, TagName, Meta>;
export type UnwrapTaggedIfNeeded<T> = T extends Tagged ? UnwrapTagged<T> : T;

type TG = Tagged;

export type WithTag<T = unknown, TagName extends PropertyKey = PropertyKey> = TF_Tagged<T, TagName>;

export type TagSymbol = keyof TF_Tagged<unknown, never>;
export type GetTagName<T> = T extends { [K in TagSymbol]: infer TagRecord } ? keyof TagRecord : never;

export type GetTagMetadata<T, TagName extends PropertyKey> = T extends TG ? TF_GetTagMetadata<T, TagName> : never;
export type UnwrapTaggedArr<T> = T extends readonly [infer H extends TG, ...infer R]
  ? [UnwrapTagged<H>, ...UnwrapTaggedArr<R>]
  : T extends []
    ? []
    : T extends ReadonlyArray<infer X extends TG>
      ? UnwrapTagged<X>[]
      : T;
export type TaggedArr<T, Tag extends PropertyKey, Meta> = T extends readonly [infer H, ...infer R]
  ? [Tagged<H, Tag, Meta>, ...TaggedArr<R, Tag, Meta>]
  : [];
