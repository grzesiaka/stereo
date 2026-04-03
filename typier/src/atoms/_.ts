import { Simplify } from "type-fest";
import { __, Tagged, WithTag } from "~types";

export interface AtomBase<Tag extends string = string, Key extends string = Tag> {
  Tag: Tag;
  Key: Key;
}

export type AtomWithInfo<Schema, Type, Tag extends string = string, Key extends string = Tag, TagInfo = __> = Simplify<
  Schema &
    AtomBase<Tag, Key> & {
      "~hint": __ extends TagInfo ? WithTag<Type, Tag> : Tagged<Type, Tag, TagInfo>;
      $: <K extends string>(
        key: Key,
      ) => TagInfo extends __ ? Atom<Schema, Type, Tag, K> : AtomWithInfo<Schema, Type, Tag, K, TagInfo>;
      Id: TagInfo extends __ ? Atom<Schema, Type, Tag, "id"> : AtomWithInfo<Schema, Type, Tag, "id", TagInfo>;
    }
>;

export type Atom<Schema, Type, Tag extends string = string, Key extends string = Tag> = AtomWithInfo<
  Schema,
  Type,
  Tag,
  Key
>;

export type $Atom<Schema extends object, Type, TagInfo> = <Tag extends string, Key extends string | `?${string}` = Tag>(
  Tag: Tag,
  Key?: Key,
) => Key extends `?${infer K}`
  ? TagInfo extends __
    ? Atom<Schema & { "~optional": true }, Type, Tag, K extends "" ? Tag : Key>
    : AtomWithInfo<Schema & { "~optional": true }, Type, Tag, K extends "" ? Tag : Key, TagInfo>
  : TagInfo extends __
    ? Atom<Schema, Type, Tag, Key>
    : AtomWithInfo<Schema, Type, Tag, Key, TagInfo>;

export const createAtom =
  <Schema extends object, Type, TagInfo>(S: Schema): $Atom<Schema, Type, TagInfo> =>
  <Tag extends string, Key extends string = Tag>(Tag: Tag, Key = Tag as any as Key) =>
    ({
      ...S,
      ...((Key[0] === "?" ? { "~optional": true } : {}) as {}),
      Tag,
      Key: Key.replace(/^\?/, ""),
      $: (Key: string) => createAtom(S)(Tag, Key),
      get Id() {
        return createAtom(S)(Tag, "id");
      },
    }) as never;
