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
