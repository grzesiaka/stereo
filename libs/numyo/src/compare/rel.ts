import type { Lt, LtOrEq, Gt, GtOrEq, Compare } from "ts-arithmetic";
import type { UnwrapTaggedIfNeeded as U } from "~types";

/**
 * Compare `a` to `b`
 * @param a first number
 * @param b second number
 * @returns `-1 | 0 | 1`
 *
 * ```
 *  (a < b ? -1 : a > b ? 1 : 0)
 * ```
 */
export const compare = <A extends number, B extends number>(a: A, b: B) =>
  (a < b ? -1 : a > b ? 1 : 0) as Compare<U<A>, U<B>>;

/**
 * ```
 * a < b
 * ```
 *
 * @returns `0 | 1`
 */
export const lt = <A extends number, B extends number>(a: A, b: B) => (a < b ? 1 : 0) as Lt<U<A>, U<B>>;
/**
 * ```
 * a <= b
 * ```
 *
 * @returns `0 | 1`
 */
export const lte = <A extends number, B extends number>(a: A, b: B) => (a <= b ? 1 : 0) as LtOrEq<U<A>, U<B>>;
/**
 * ```
 * a > b
 * ```
 *
 * @returns `0 | 1`
 */
export const gt = <A extends number, B extends number>(a: A, b: B) => (a > b ? 1 : 0) as Gt<U<A>, U<B>>;
/**
 * ```
 * a >= b
 * ```
 *
 * @returns `0 | 1`
 */
export const gte = <A extends number, B extends number>(a: A, b: B) => (a >= b ? 1 : 0) as GtOrEq<U<A>, U<B>>;

export default {
  "<": lt,
  "<=": lte,
  ">": gt,
  ">=": gte,
  "?": compare,
};
