import { TypierBase } from "../0";
import { __ } from "~types";

type Rekey<Schema extends object, $TYP extends string = string> = <const K extends string>(
  key: K,
) => $Compound<Schema, $TYP, K>;

export type Compound<Schema extends object, $TYP extends string = string, $KEY extends string = $TYP> = Schema &
  TypierBase<$TYP, $KEY> & {
    $: Rekey<Schema, $TYP>;
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
      $: ($KEY: string) => createCompound(S)($TYP, $KEY === "?" ? `?${$TYP}` : $KEY),
    }) as never;
