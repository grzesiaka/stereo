import { TObjectOptions, TObject, TProperties } from "typebox";
import { createCompound, $Compound } from "./0";
import { TypierBase } from "../0";
import { Indexify, indexify } from "proyij";

export type ObjectParts = readonly TypierBase[];

export type Obj<
  Parts extends ObjectParts,
  Options extends TObjectOptions,
  $TYP extends string,
  $KEY extends string,
> = TObject<Indexify<Parts, "$KEY"> extends TProperties ? Indexify<Parts, "$KEY"> : never> &
  $Compound<
    Options & {
      type: "object";
      "~kind": "Object";
      $PARTS: Parts;
    },
    $TYP,
    $KEY
  >;

export const $Obj = <const Parts extends ObjectParts, const Options extends TObjectOptions>(
  parts: Parts,
  options?: Options,
) =>
  createCompound({
    ...options,
    ype: "object",
    "~kind": "Object",
    $PARTS: parts,
    properties: indexify("$KEY")(parts),
    required: parts.flatMap((p) => ((p as any)["~optional"] ? [] : [p.$KEY])),
  } as any) as <const $TYP extends string, const $KEY extends string = $TYP>(
    $TYP: $TYP,
    $KEY?: $KEY,
    // this type gymnastics is kind of weird; not sure if there is some regression in TS 6.x
  ) => Obj<Parts, TObjectOptions extends Options ? {} : Options, $TYP, string extends $KEY ? $TYP : $KEY>;

export const Obj = <const Parts extends ObjectParts>(...parts: Parts) => $Obj(parts);
Obj.$ = $Obj;
export default Obj;
