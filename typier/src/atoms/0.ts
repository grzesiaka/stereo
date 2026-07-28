import { Simplify } from "type-fest";
import { __, Tagged, WithTag } from "~types";
import { TypierBase } from "../0";
import { resolveKey, ResolveKey } from "../_";

type Rekey<Schema extends object, Type, $TYP extends string, $KEY extends string, $META> = <
  const K extends string,
  const T extends string = $TYP,
>(
  key: K,
  typ?: T,
) => $Atom<Schema, Type, T, ResolveKey<$KEY, K>, $META>;

export type Atom<
  Schema extends object,
  Type,
  $TYP extends string = string,
  $KEY extends string = $TYP,
  $META = __,
> = Schema &
  TypierBase<$TYP, $KEY> & {
    "~unsafe": __ extends $META ? WithTag<Type, $TYP> : Tagged<Type, $TYP, $META>;
    $: Rekey<Schema, Type, $TYP, $KEY, $META>;
  };

export type Atom0<Schema extends object, Type, $TYP extends string = string, $KEY extends string = $TYP> = Atom<
  Schema,
  Type,
  $TYP,
  $KEY
>;

export type $Atom<
  Schema extends object = {},
  Type = any,
  $TYP extends string = string,
  $KEY extends string = string,
  $META = any,
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
      ...S,
      ...(($KEY[0] === "?" ? { "~optional": true } : {}) as {}),
      $TYP,
      $KEY: $KEY.replace(/^\?/, "") || ($KEY ? $TYP : ""),
      $: ($NEW_KEY: string, $NEW_TYP = $TYP) => createAtom(S)($NEW_TYP, resolveKey($KEY, $NEW_KEY)),
    }) as never;

export type RetypeAtom<
  A extends Atom<object, any, string, string, any>,
  K extends string = A["$KEY"],
  TYP extends string = A["$TYP"],
> = A extends Atom<infer S, infer T, any, any, infer M> ? Atom<S, T, K, TYP, M> : never;
