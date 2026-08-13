import { ARR } from "~types";

export type Arryo<X = unknown> = ReadonlyArray<X | Arryo<X>>;
export type Arryo$X<A> = A extends Arryo<infer X> ? X : never;
/**
 * Creates a union of all values from deeply nested arrays / tuples matching particular shape.
 *
 * A very handy in transforming nested arrays into an object.
 */
export type NestedArrays$ValuesUnion<T, Shape = unknown> = T extends Shape
  ? T
  : T extends readonly (infer E)[]
    ? NestedArrays$ValuesUnion<E, Shape>
    : never;

export type Head<X, E = never> = X extends readonly [infer H, ...any[]] ? H : X extends readonly [] ? E : X;
export type Tail<X, E = never> = X extends readonly [any, ...infer R] ? R : X extends readonly [] ? E : X;

/**
 * Easily control shape of deeply nested arrays.
 *
 * The type parameters might be anything, but [ARR, ARR] is special:
 *
 * ```
 * LR extends readonly [ARR, ARR]
 * ? LR[1] extends readonly []
 *   ? LR[0] extends readonly [infer L]
 *     ? L
 *     : LR[0]
 *   : [...LR[0], Shapes<LR[1]>]
 * : LR
 * ```
 * If `LR[0]` is an array and `LR[1]` is a non-empty array it will recursively expand as the last element.
 * If `LR[0]` is single element array, it will be unwrapped.
 */
export type Shape<LR> = LR extends readonly [ARR, ARR]
  ? LR[1] extends readonly []
    ? LR[0] extends readonly [infer L]
      ? L
      : LR[0]
    : [...LR[0], Shapes<LR[1]>]
  : LR;

export type Shapes<LRs> = LRs extends readonly [infer LR, ...infer R]
  ? [Shape<LR>, ...Shapes<R>]
  : LRs extends readonly []
    ? []
    : LRs extends ARR<infer LR>
      ? ARR<Shape<LR>>
      : LRs;

// TODO make meaningful examples & remove this
// type T0 = Shape<1 | 2 | [["a"], ["aa"]] | [["b", "b.0"], [[["bb", 1], ["c"]]]]>;
// const t0 = ["b", "b.0", [["bb", 1, ["c"]]]] as const satisfies T0;

// type T1 = Shape<1 | 2 | [["a"], ["aa"]] | [["b", "b.0"], ["bb", ["c"]]]>;
// const t1 = ["b", "b.0", ["bb", ["c"]]] as const satisfies T1;

// type T_ARR = Shape<[[], ARR<"x" | "y">]>;
// const arr = [["x", "y", "x", "y"]] as const satisfies T_ARR;

// type T_ARRn = Shapes<ARR<["y", ["a", ...ARR<"x|y">]] | "x" | "_y_">>;
// const arrn = ["x", "_y_", "x", ["y", ["a", "x|y"]]] as const satisfies T_ARRn;
