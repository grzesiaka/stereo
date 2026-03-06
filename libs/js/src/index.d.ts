export * from "./num";
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
export declare const __: undefined;
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
export type Fn<I extends ARR = ARR, O = unknown, E = {}> = (E extends string ? {
    name: E;
} : {}) & ((...i: I) => O);
/**
 * Function with 0 parameters or a single optional parameter
 */
export type Fn0<O = unknown, I = never, E = {}> = [I] extends [never] ? Fn<[], O, E> : Fn<[I?], O, E>;
/**
 * Single parameter function
 */
export type Fn1<I = any, O = unknown, E = {}> = Fn<[I], O, E>;
/**
 * A callback
 */
export type Cb<X = any> = (x: X) => void;
/**
 * Function to its input
 */
export type Fn$I<F> = F extends Fn<infer I> ? I : never;
/**
 * Function to its output
 */
export type Fn$O<F> = F extends Fn<any, infer O> ? O : never;
/**
 * Identity
 *
 * `<X>(x: X) => x`
 *
 * @param x a value
 * @returns `x`
 */
export declare const id: <X>(x: X) => X;
/**
 * An alias for:
 *
 * `Object.assign`
 *
 * @todo Improve the typing of built-in typescript's Object.assign
 */
export declare const a: {
    <T extends {}, U>(target: T, source: U): T & U;
    <T extends {}, U, V>(target: T, source1: U, source2: V): T & U & V;
    <T extends {}, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    (target: object, ...sources: any[]): any;
};
/**
 * Upgrades value by merging it with a result of a computation based on that value
 *
 * @param x a value to upgrade
 * @param $ derived properties
 * @returns `Object.assign(x, $(x))`
 */
export declare const u: <X extends object, Y>(x: X, $: (x: X) => Y) => X & Y;
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
export declare const OP: <OP_ID extends string>(id: OP_ID) => <const Params>(p: Params) => <X extends {}>(x: X) => X & {
    __: OP<OP_ID, Params>;
};
//# sourceMappingURL=index.d.ts.map