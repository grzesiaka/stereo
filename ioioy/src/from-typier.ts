import * as TR from "typier";
import V, { type Var } from "./var";
import Vs, { type And_Vars } from "./vars";
import OneOf, { type OneOf_IOs } from "./one-of";
import { __ } from "~types";
import { Parse } from "typebox/value";

export const TYPIER: unique symbol = Symbol.for("TYPIER");

type WithUndefinedIfOptionalOrNoDefault<T> = T extends { "~optional": true }
  ? __
  : T extends { default: any }
    ? never
    : __;

type TypierArrayToIO<T> = T extends readonly [infer H, ...infer R] ? [FromTypier<H>, ...TypierArrayToIO<R>] : [];

export type FromTypier<T> = T extends readonly unknown[]
  ? TypierArrayToIO<T>
  : T extends TR.$Atom
    ? Var<
        { Id: T["$KEY"]; [TYPIER]: T },
        (T extends { "~hint": infer X } ? X : TR.Static<T>) | WithUndefinedIfOptionalOrNoDefault<T>
      >
    : T extends TR.OBJECT<infer Parts, any, any, infer Key>
      ? And_Vars<
          {
            Id: Key;
            [TYPIER]: T;
          },
          TypierArrayToIO<Parts>
        >
      : T extends TR.UNION<infer Items, any, any, infer Key>
        ? OneOf_IOs<
            {
              Id: Key;
              [TYPIER]: T;
            },
            TypierArrayToIO<Items>
          >
        : T extends TR.$Atom
          ? Var<
              { Id: T["$KEY"]; [TYPIER]: T },
              (T extends { "~hint": infer X } ? X : TR.Static<T>) | WithUndefinedIfOptionalOrNoDefault<T>
            >
          : never;

export const fromTypier = <T extends TR.ATOM | TR.COMPOUND | TR.$Atom>(t: T): FromTypier<T> => {
  switch (t.type) {
    case "object":
      return 1 as any;
    case "union":
      return 2 as any;
    default:
      return V((t as any).default, { Id: t.$KEY, [TYPIER]: t }) as any;
  }
};

const TY = TR.fromTree({
  B: TR.B(true),
  N: TR.N(),
  Str: TR.S({ minLength: 5 }),
  Str2: TR.S({}),
});

const b = fromTypier(TY.B);

const c = b.X;
const fb = (b: boolean) => 1;
fb(b.X);
const s = fromTypier(TY.Str);
const n = fromTypier(TR.N(1)("num", "?"));
const a = fromTypier(TR.A(TY.B)("A"));

const U = TR.U(TY.B, TY.N)("UNI");
const u = fromTypier(U);
// u.I();
const O = TR.O(TY.B, TY.N, TY.Str)("O");
const X = fromTypier(O);

const z = Parse(O, 1);
X.I({ B: z.B });
