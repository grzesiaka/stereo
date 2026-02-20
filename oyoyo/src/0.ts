/**
 *  Potential / Hole / Future
 * 
 * `X | undefined`
 */
export type __<X = never> = X | undefined

/**
 * `Exclude<X, undefined>`
 */
export type $$<X = unknown> = Exclude<X, undefined>

/**
 * Unnamed, ordered group
 * 
 * `ReadonlyArray<X>` / `readonly X[]`
 */
export type ARR<X = any> = ReadonlyArray<X>

/**
 * Function with optional attached information
 */
export type Fn<I extends ARR = ARR, O = unknown, E = {}> = (E extends string ? { name: E } : {}) & ((...i: I) => O);

/**
 * An alias for:
 * 
 * `Object.assign`
 * 
 * @todo Improve the typing of built-in typescript's Object.assign
 */
export const a = Object.assign

/**
 * Tags an object-like value with its direct context
 * 
 * @param operation_id id of the operation
 * @param operation_params params of the operation
 * @param x value to be tagged
 * @returns `Object.assign(x, { __: [Params, OP_ID] })`
 */
export const OP = <OP_ID extends string>(id: OP_ID) => <Params>(p: Params) => <X extends {}>(x: X) =>
    a(x, { __: [p, id] as [Params, OP_ID]})
