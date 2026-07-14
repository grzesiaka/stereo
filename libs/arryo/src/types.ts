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
