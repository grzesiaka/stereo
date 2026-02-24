import { UnknownRecord } from "type-fest";

/**
 *  Potential / Hole / Future
 *
 * `X | undefined`
 */
export type __<X = never> = X | undefined;

/**
 * bottom / `undefined`
 *
 * `void 0`
 */
export const __ = void 0;
/**
 * `Exclude<X, undefined>`
 */
export type $$<X = unknown> = Exclude<X, __>;

export type FLIP<X> = __ extends X ? [$$<X>] : [__<X>?];

/**
 * Unnamed, ordered group
 *
 * `ReadonlyArray<X>` / `readonly X[]`
 */
export type ARR<X = any> = ReadonlyArray<X>;

/**
 * Function with optional attached information
 */
export type Fn<I extends ARR = ARR, O = unknown, E = {}> = (E extends string ? { name: E } : {}) & ((...i: I) => O);

/**
 * Single parameter function
 */
export type Fn1<I = any, O = unknown, E = {}> = Fn<[I], O, E>;

/**
 * Function to its input
 */
export type Fn$I<F> = F extends Fn<infer I> ? I : never;
/**
 * Function to its output
 */
export type Fn$O<F> = F extends Fn<any, infer O> ? O : never;

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
export const u = <X extends UnknownRecord, Y>(x: X, $: (x: X) => Y) => a(x, $(x));

/**
 * Tags an object-like value with its direct context
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
    a(x, { __: [p, id] as [Params, OP_ID] });
