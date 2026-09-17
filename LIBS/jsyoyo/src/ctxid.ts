import { Simplify } from "type-fest";
import { __ } from "~types";
import { a } from "objoy";

type O = { [k in PropertyKey]: unknown } | {};
export type CtxIdOptional<Ctx extends O = O, Other extends O = O> =
  | __
  | string
  | Simplify<{ Id?: string } & Ctx & Other>;
export type CtxIdRequired<Ctx extends O = O, Other extends O = O> = string | Simplify<{ Id: string } & Ctx & Other>;

export type CtxId$Id<L extends CtxIdOptional> = L extends { Id: infer S extends string }
  ? S
  : L extends string
    ? L
    : never;

export type CtxId<L extends CtxIdOptional, E = {}> = Simplify<
  E & (L extends string ? { Id: L } : __ extends L ? {} : L)
>;
export const CtxId = <X extends {}, L extends CtxIdOptional, E>(x: X, L: L, E?: E) =>
  a(x, typeof L === "string" ? { Id: L } : L, E) as X & CtxId<L, E>;
export default CtxId;
