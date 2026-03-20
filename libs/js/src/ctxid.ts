import { Simplify } from "type-fest";
import { __ } from "~types";

import { a } from ".";

export type CtxIdConstraint = __ | PropertyKey | { Id?: PropertyKey; [k: PropertyKey]: unknown };

export type CtxId<L extends CtxIdConstraint, E = {}> = Simplify<
  E & (L extends string ? { Id: L } : __ extends L ? {} : L)
>;
export const CtxId = <X extends {}, L extends CtxIdConstraint, E>(x: X, L: L, E?: E) =>
  a(x, typeof L === "string" ? { Id: L } : L, E) as X & CtxId<L, E>;
export default CtxId;
