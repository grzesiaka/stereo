import * as TR from "typier";
import V, { type Var } from "./var";
import Vs, { type Vars } from "./vars";
import OneOf, { type OneOf_IOs } from "./one-of";
import { __ } from "~types";

export const TYPIER: unique symbol = Symbol.for("TYPIER");

type WithUndefinedIfOptionalOrNoDefault<T> = T extends { "~optional": true }
  ? __
  : T extends { default: any }
    ? never
    : __;

export type FromTypier<T extends TR.ATOM | TR.COMPOUND | TR.$Atom> =
  T extends TR.OBJECT<infer Parts, infer Options, any, infer Key>
    ? 1
    : T extends TR.UNION<infer Items, infer Options, any, infer Key>
      ? 2
      : Var<
          { Id: T["$KEY"]; [TYPIER]: T },
          (T extends { "~hint": infer X } ? X : TR.Static<T>) | WithUndefinedIfOptionalOrNoDefault<T>
        >;

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
