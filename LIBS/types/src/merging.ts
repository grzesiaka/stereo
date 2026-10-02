import { __ } from "./base-types";

/**
 * Keeps only defined properties
 */
export type DefinedProps<X extends object> = { [K in keyof X]: X[K] extends __ ? never : K };

/**
 * Merges two types, by picking props from the second which are not present in first
 */
export type WithFallback<Object extends object, Fallback extends object> = Object &
  Omit<Fallback, keyof DefinedProps<Object>>;

/**
 * `WithFallback<DefinedProps<Object>, Fallback>>`
 */
export type DefinedWithFallback<Object extends object, Fallback extends object> = DefinedProps<Object> &
  Omit<Fallback, keyof DefinedProps<Object>>;
