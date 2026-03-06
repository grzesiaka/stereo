export * from "./num";
/**
 * bottom / `undefined`
 *
 * `void 0`
 */
export const __ = void 0;
/**
 * Identity
 *
 * `<X>(x: X) => x`
 *
 * @param x a value
 * @returns `x`
 */
export const id = (x) => x;
/**
 * An alias for:
 *
 * `Object.assign`
 *
 * @todo Improve the typing of built-in typescript's Object.assign
 */
export const a = Object.assign;
/**
 * Upgrades value by merging it with a result of a computation based on that value
 *
 * @param x a value to upgrade
 * @param $ derived properties
 * @returns `Object.assign(x, $(x))`
 */
export const u = (x, $) => a(x, $(x));
/**
 * Tags a result of operation with operation id and operation paramss
 *
 * @param operation_id id of the operation
 * @param operation_params params of the operation
 * @param x value to be tagged
 * @returns `Object.assign(x, { __: [Params, OP_ID] })`
 */
export const OP = (id) => (p) => (x) => a(x, { __: [id, p] });
