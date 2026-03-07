// export * from "./num";

// TODO remove from here and fix imports
export * from "~types";

/**
 * bottom / `undefined`
 *
 * `void 0`
 */
export const __ = void 0;

export type __<X = never> = X | undefined;

/**
 * Identity
 *
 * `<X>(x: X) => x`
 *
 * @param x a value
 * @returns `x`
 */
export const id = <X>(x: X) => x;

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
export const u = <X extends object, Y>(x: X, $: (x: X) => Y) => a(x, $(x));

export interface WithOP<OP_ID extends string, Params> {
  __: OP<OP_ID, Params>;
}

export type OP<OP_ID extends string = string, Params = unknown> = [OP_ID, Params];
/**
 * Tags a result of operation with operation id and operation paramss
 *
 * @param operation_id id of the operation
 * @param operation_params params of the operation
 * @param x value to be tagged
 * @returns `Object.assign(x, { __: [Params, OP_ID] })`
 */
export const OP =
  <OP_ID extends string>(id: OP_ID) =>
  <const Params>(p: Params) =>
  <X extends {}>(x: X) =>
    a(x, { __: [id, p] as OP<OP_ID, Params> });
