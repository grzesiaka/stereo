export * from "ififify";
export * from "objoy";
export * from "~types";

/**
 * bottom / `undefined`
 *
 * `void 0`
 */
export const __ = void 0;

/**
 *  Potential / Hole / Future
 *
 * `X | undefined`
 */
export type __<X = never> = X | undefined;
