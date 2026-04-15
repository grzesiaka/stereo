import { Static, TSchema, TCodec } from "typebox";
import { WithTag } from "~types";
import { TypierBase } from "../0";
import { resolveKey, ResolveKey } from "../_";

type Rekey<Schema extends object, Type, $TYP extends string, $KEY extends string> = <const K extends string>(
  key: K,
) => Codec<Schema, Type, $TYP, ResolveKey<$KEY, K>>;

export type Codec<T extends TSchema, X, $TYP extends string, $KEY extends string> = TCodec<
  Omit<T, "$TYP" | "$KEY" | "$">,
  WithTag<X, $TYP>
> &
  TypierBase<$TYP, $KEY> & {
    $: Rekey<T, X, $TYP, $KEY>;
  } & ($KEY extends `?${string}` ? { "~optional": true } : {});

export const Codec =
  <S extends TSchema, X>(S: S, decode: (v: Static<S>) => X, encode: (v: X) => unknown) =>
  <const $TYP extends string, const $KEY extends string = $TYP>($TYP: $TYP, $KEY = $TYP as never as $KEY) => {
    return {
      ...S,
      ...(($KEY[0] === "?" ? { "~optional": true } : {}) as {}),
      $TYP,
      $KEY: $KEY.replace(/^\?/, "") || ($KEY ? $TYP : ""),
      "~codec": {
        decode,
        encode,
      },
      $: ($NEW_KEY: string) => Codec(S, decode, encode)($TYP, resolveKey($KEY, $NEW_KEY)),
    } as never as Codec<S, X, $TYP, $KEY>;
  };
