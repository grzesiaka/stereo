import { __, Tagged, WithTag } from "~types";

export interface AtomBase<Tag extends string = string, Key extends string = Tag> {
  Tag: Tag;
  Key: Key;
}

export type Rekey<Schema extends object, Type, Tag extends string = string, TagInfo = __> = <K extends string>(
  key: K,
) => $Atom<Schema, Type, Tag, K, TagInfo>;

export type Atom<
  Schema extends object,
  Type,
  Tag extends string = string,
  Key extends string = Tag,
  TagInfo = __,
> = Schema &
  AtomBase<Tag, Key> & {
    "~kind": "Unsafe";
    "~hint": __ extends TagInfo ? WithTag<Type, Tag> : Tagged<Type, Tag, TagInfo>;
    $: Rekey<Schema, Type, Tag, TagInfo>;
  };

export type Atom0<Schema extends object, Type, Tag extends string = string, Key extends string = Tag> = Atom<
  Schema,
  Type,
  Tag,
  Key
>;

export type $Atom<
  Schema extends object,
  Type,
  Tag extends string,
  Key extends string,
  TagInfo,
> = Key extends `?${infer K}`
  ? __ extends TagInfo
    ? Atom0<Schema & { "~optional": true }, Type, Tag, K extends "" ? Tag : K>
    : Atom<Schema & { "~optional": true }, Type, Tag, K extends "" ? Tag : K, TagInfo>
  : __ extends TagInfo
    ? Atom0<Schema, Type, Tag, Key>
    : Atom<Schema, Type, Tag, Key, TagInfo>;

export const createAtom =
  <Schema extends object, Type, TagInfo>(S: Schema) =>
  <Tag extends string, Key extends string = Tag>(
    Tag: Tag,
    Key = Tag as any as Key,
  ): $Atom<Schema, Type, Tag, Key, TagInfo> =>
    ({
      "~kind": "Unsafe",
      ...S,
      ...((Key[0] === "?" ? { "~optional": true } : {}) as {}),
      Tag,
      Key: Key.replace(/^\?/, ""),
      $: (Key: string) => createAtom(S)(Tag, Key === "?" ? `?${Tag}` : Key),
    }) as never;
