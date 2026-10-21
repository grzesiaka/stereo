import { id, __ } from "jsyoyo";
import { $$ } from "~types";

// export const isXSet = <F extends object>(f: F): f is F & { X: unknown } => "X" in f;
/**
 * Conditional flow depending if X is not `undefined`
 *
 * @param io
 * @param resolved
 * @param pending
 * @returns
 */
export const ifResolved = <F extends { X?: unknown }, R = $$<F["X"]>, P = __>(
  io: F,
  resolved = id as (x: $$<F["X"]>) => R,
  pending = id as () => __ as () => P,
) => (io["X"] !== __ ? resolved(io["X"] as $$<F["X"]>) : pending());
