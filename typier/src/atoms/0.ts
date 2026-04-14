import { Simplify } from "type-fest";
import { __, Tagged, WithTag } from "~types";
import { TypierBase } from "../0";
import { resolveKey, ResolveKey } from "../_";

type Rekey<Schema extends object, Type, $TYP extends string, $KEY extends string, $META> = <const K extends string>(
  key: K,
) => $Atom<Schema, Type, $TYP, ResolveKey<$KEY, K>, $META>;

export type Atom<
  Schema extends object,
  Type,
  $TYP extends string = string,
  $KEY extends string = $TYP,
  $META = __,
> = Schema &
  TypierBase<$TYP, $KEY> & {
    "~kind": "Unsafe";
    "~hint": __ extends $META ? WithTag<Type, $TYP> : Tagged<Type, $TYP, $META>;
    $: Rekey<Schema, Type, $TYP, $KEY, $META>;
  };

export type Atom0<Schema extends object, Type, $TYP extends string = string, $KEY extends string = $TYP> = Atom<
  Schema,
  Type,
  $TYP,
  $KEY
>;

export type $Atom<
  Schema extends object,
  Type,
  $TYP extends string,
  $KEY extends string,
  $META,
> = $KEY extends `?${infer K}`
  ? __ extends $META
    ? Atom0<Simplify<Schema & { "~optional": true }>, Type, $TYP, K extends "" ? $TYP : K>
    : Atom<Simplify<Schema & { "~optional": true }>, Type, $TYP, K extends "" ? $TYP : K, $META>
  : __ extends $META
    ? Atom0<Schema, Type, $TYP, $KEY>
    : Atom<Schema, Type, $TYP, $KEY, $META>;

export const createAtom =
  <Schema extends object, Type, $META>(S: Schema) =>
  <const $TYP extends string, const $KEY extends string = $TYP>(
    $TYP: $TYP,
    $KEY = $TYP as any as $KEY,
  ): $Atom<Schema, Type, $TYP, $KEY, $META> =>
    ({
      "~kind": "Unsafe",
      ...S,
      ...(($KEY[0] === "?" ? { "~optional": true } : {}) as {}),
      $TYP,
      $KEY: $KEY.replace(/^\?/, "") || ($KEY ? $TYP : ""),
      $: ($NEW_KEY: string) => createAtom(S)($TYP, resolveKey($KEY, $NEW_KEY)),
    }) as never;
