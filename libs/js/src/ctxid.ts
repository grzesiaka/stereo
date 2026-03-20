import { Simplify } from "type-fest";
import { __ } from "~types";

import { a } from ".";

export type CtxId<L, E = {}> = Simplify<E & (L extends string ? { Id: L } : __ extends L ? {} : L)>;
export const CtxId = <X extends {}, L, E>(x: X, L: L, E?: E) =>
  a(x, typeof L === "string" ? { Id: L } : L, E) as X & CtxId<L, E>;
export default CtxId;
