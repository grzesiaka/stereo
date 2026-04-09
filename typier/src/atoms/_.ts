import { __, Tagged, WithTag } from "~types";
import { TypierBase as AtomBase } from "../types";

export type Rekey<Schema extends object, Type, $TYP extends string = string, $META = __> = <K extends string>(
  key: K,
) => $Atom<Schema, Type, $TYP, K, $META>;

export type Atom<
  Schema extends object,
  Type,
  $TYP extends string = string,
  $KEY extends string = $TYP,
  $META = __,
> = Schema &
  AtomBase<$TYP, $KEY> & {
    "~kind": "Unsafe";
    "~hint": __ extends $META ? WithTag<Type, $TYP> : Tagged<Type, $TYP, $META>;
    $: Rekey<Schema, Type, $TYP, $META>;
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
    ? Atom0<Schema & { "~optional": true }, Type, $TYP, K extends "" ? $TYP : K>
    : Atom<Schema & { "~optional": true }, Type, $TYP, K extends "" ? $TYP : K, $META>
  : __ extends $META
    ? Atom0<Schema, Type, $TYP, $KEY>
    : Atom<Schema, Type, $TYP, $KEY, $META>;

export const createAtom =
  <Schema extends object, Type, $META>(S: Schema) =>
  <$TYP extends string, $KEY extends string = $TYP>(
    $TYP: $TYP,
    $KEY = $TYP as any as $KEY,
  ): $Atom<Schema, Type, $TYP, $KEY, $META> =>
    ({
      "~kind": "Unsafe",
      ...S,
      ...(($KEY[0] === "?" ? { "~optional": true } : {}) as {}),
      $TYP,
      $KEY: $KEY.replace(/^\?/, "") || ($KEY ? $TYP : ""),
      $: ($KEY: string) => createAtom(S)($TYP, $KEY === "?" ? `?${$TYP}` : $KEY),
    }) as never;
