import * as TR from "typier";
import V, { type Var } from "./var";
import Vs, { type And_Vars } from "./vars";
import OneOf, { type OneOf_IOs } from "./one-of";
import { __, ARR } from "~types";
import { IdIOs } from "./io";

export const TYPIER: unique symbol = Symbol.for("TYPIER");

type WithUndefinedIfOptionalOrNoDefault<T> = T extends { "~optional": true }
  ? __
  : T extends { default: any }
    ? never
    : __;

type TypierArrayToIO<T> = T extends readonly [infer H, ...infer R]
  ? H extends { type: "null" }
    ? TypierArrayToIO<R>
    : [FromTypier<H>, ...TypierArrayToIO<R>]
  : [];

export type FromTypier<T> = T extends readonly unknown[]
  ? TypierArrayToIO<T>
  : T extends TR.$Atom
    ? Var<
        { Id: T["$KEY"]; [TYPIER]: T },
        (T extends { "~hint": infer X } ? X : TR.Static<T>) | WithUndefinedIfOptionalOrNoDefault<T>
      >
    : T extends { type: "object"; $PARTS: infer Parts; $KEY: infer Key extends string; "~optional"?: infer Optional }
      ? And_Vars<
          {
            Id: Key;
            [TYPIER]: T;
          },
          TypierArrayToIO<Parts> extends IdIOs ? TypierArrayToIO<Parts> : [],
          Optional extends true ? [undefined] : []
        >
      : T extends {
            type: "union";
            anyOf: infer Items extends ARR;
            $KEY: infer Key extends string;
            "~optional"?: infer Optional;
          }
        ? OneOf_IOs<
            {
              Id: Key;
              [TYPIER]: T;
            },
            TypierArrayToIO<Items>,
            [...(Optional extends true ? [undefined] : []), ...({ type: "null" } extends Items[number] ? [null] : [])]
          >
        : never;

export const fromTypier = <T extends TR.ATOM | TR.COMPOUND | TR.$Atom>(t: T): FromTypier<T> => {
  const L = {
    Id: t.$KEY,
    [TYPIER]: t,
  };
  switch (t.type) {
    case "object":
      // @ts-expect-error return type + t.$PARTS
      return Vs(L)(t.$PARTS.map(fromTypier));
    case "union":
      // @ts-expect-error  t.anyOf
      const r = OneOf(L)(t.anyOf.flatMap((i) => (i.type === "null" ? [] : fromTypier(i))));
      // @ts-expect-error  t.anyOf
      t.anyOf[0]?.type === "null" && r.I(null);
      // @ts-expect-error return type
      return r;
    default:
      return V((t as any).default, L) as never;
  }
};
