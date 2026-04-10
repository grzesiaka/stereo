import { resolveKey, ResolveKey, TypierBase } from "../0";
import { __ } from "~types";

type Rekey<Schema extends object, $TYP extends string, $KEY extends string> = <const K extends string>(
  key: K,
) => $Compound<Schema, $TYP, ResolveKey<$KEY, K>>;

export type Compound<Schema extends object, $TYP extends string = string, $KEY extends string = $TYP> = Schema &
  TypierBase<$TYP, $KEY> & {
    $: Rekey<Schema, $TYP, $KEY>;
  };

export type $Compound<Schema extends object, $TYP extends string, $KEY extends string> = $KEY extends `?${infer K}`
  ? Compound<Schema & { "~optional": true }, $TYP, K extends "" ? $TYP : K>
  : Compound<Schema, $TYP, $KEY>;

export const createCompound =
  <Schema extends object>(S: Schema) =>
  <$TYP extends string, $KEY extends string = $TYP>(
    $TYP: $TYP,
    $KEY = $TYP as any as $KEY,
  ): $Compound<Schema, $TYP, $KEY> =>
    ({
      ...S,
      ...(($KEY[0] === "?" ? { "~optional": true } : {}) as {}),
      $TYP,
      $KEY: $KEY.replace(/^\?/, "") || ($KEY ? $TYP : ""),
      $: ($NEW_KEY: string) => createCompound(S)($TYP, resolveKey($KEY, $NEW_KEY)),
    }) as never;
