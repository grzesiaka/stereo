export * from "ififify";
export * from "objoy";

export * from "./num";
export * from "~types";
export * as parse from "./parse";
export * as is from "./is";

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
