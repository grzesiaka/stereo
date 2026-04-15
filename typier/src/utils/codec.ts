import { Static, TSchema, TCodec } from "typebox";
import { __, Tagged, WithTag } from "~types";
import { TypierBase } from "../0";
import { resolveKey, ResolveKey } from "../_";

type Rekey<Schema extends object, Type, $TYP extends string, $KEY extends string, $META> = <const K extends string>(
  key: K,
) => Codec<Schema, Type, $TYP, ResolveKey<$KEY, K>, $META>;

export type Codec<T extends TSchema, X, $TYP extends string, $KEY extends string, $META> = TCodec<
  Omit<T, "$TYP" | "$KEY" | "$">,
  __ extends $META ? WithTag<X, $TYP> : Tagged<X, $TYP, $META>
> &
  TypierBase<$TYP, $KEY> & {
    $: Rekey<T, X, $TYP, $KEY, $META>;
  } & ($KEY extends `?${string}` ? { "~optional": true } : {});

export const Codec =
  <S extends TSchema, X, $META = __>(S: S, decode: (v: Static<S>) => X, encode: (v: X) => NoInfer<Static<S>>) =>
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
    } as never as Codec<S, X, $TYP, $KEY, $META>;
  };

export default Codec;
