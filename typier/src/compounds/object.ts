import { TObjectOptions, TObject, TProperties } from "typebox";
import { createCompound, $Compound } from "./0";
import { TypierBase } from "../0";
import { Indexify, indexify } from "proyij";

export type OBJECT_PARTS = readonly TypierBase[];

export type OBJECT<
  Parts extends OBJECT_PARTS = OBJECT_PARTS,
  Options extends TObjectOptions = { required?: any },
  $TYP extends string = string,
  $KEY extends string = string,
> = TObject<Indexify<Parts, "$KEY"> extends TProperties ? Indexify<Parts, "$KEY"> : never> &
  $Compound<
    TObject<Indexify<Parts, "$KEY"> extends TProperties ? Indexify<Parts, "$KEY"> : never> &
      Options & {
        type: "object";
        "~kind": "Object";
        $PARTS: Parts;
      },
    $TYP,
    $KEY
  >;

/**
 * Create Object compound
 * @param parts
 * @param options
 * @returns
 */
export const $Obj = <const Parts extends OBJECT_PARTS, const Options extends TObjectOptions>(
  parts: Parts,
  options?: Options,
) =>
  createCompound({
    ...options,
    type: "object",
    "~kind": "Object",
    $PARTS: parts,
    properties: indexify("$KEY")(parts),
    required: parts.flatMap((p) => ((p as any)["~optional"] ? [] : [p.$KEY])),
  } as any) as <const $TYP extends string, const $KEY extends string = $TYP>(
    $TYP: $TYP,
    $KEY?: $KEY,
    // (below remark might have something to do with the String index signature present on TSchema)
    // this type gymnastics is kind of weird; not sure if there is some regression in TS 6.x
  ) => OBJECT<Parts, TObjectOptions extends Options ? {} : Options, $TYP, string extends $KEY ? $TYP : $KEY>;

/**
 * Create Object compound with no options.
 * Use `.$` for full constructor
 * @param parts
 * @returns
 */
export const Obj = <const Parts extends OBJECT_PARTS>(...parts: Parts) => $Obj(parts);
Obj.$ = $Obj;
export default Obj;
