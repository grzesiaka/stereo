/**
 *  Potential / Hole / Future
 *
 * `X | undefined`
 */
export type __<X = never> = X | undefined;

/**
 * `Exclude<X, undefined>`
 */
export type $$<X = unknown> = Exclude<X, __>;

export type FLIP<X> = __ extends X ? [$$<X>] : [__<X>?];

/**
 *
 * `ReadonlyArray<X>` / `readonly X[]`
 */
export type ARR<X = any> = ReadonlyArray<X>;

/**
 * Non empty readonly array
 *
 * `readonly [X, ...R[]]`
 *
 */
export type ARR1<X = any, R = X> = readonly [X, ...R[]];

/**
 * Function with optional attached information
 */
export type Fn<I extends ARR = ARR, O = unknown, E = {}> = (E extends string ? { Id: E } : {}) & ((...i: I) => O);

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
export type Cb<X = any, R extends ARR = []> = (x: X, ...r: R) => void;

/**
 * Function to its input
 */
export type Fn$I<F> = F extends Fn<infer I> ? I : never;
/**
 * Function to its output
 */
export type Fn$O<F> = F extends Fn<any, infer O> ? O : never;

/**
 * Dispose
 */
export type Dispose = () => void;

/** Disposable */
export interface Disposable {
  (): void;
}

export type MakeUndefinedParamsOptional<X> = X extends readonly [infer H, ...infer R]
  ? undefined extends H
    ? [H?, ...MakeUndefinedParamsOptional<R>]
    : X extends readonly [(infer H)?, ...infer R]
      ? [H?, ...MakeUndefinedParamsOptional<R>]
      : [H, ...MakeUndefinedParamsOptional<R>]
  : [];

type OptionalOrUndefinedKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : undefined extends T[K] ? K : never;
}[keyof T];

type _FlipProperties<T> = {
  [K in keyof T as K extends OptionalOrUndefinedKeys<T> ? never : K]+?: T[K];
} & {
  [K in keyof T as K extends OptionalOrUndefinedKeys<T> ? K : never]-?: Exclude<T[K], undefined>;
} & {};

export type FlipOptionalAndRequiredProperties<T> = {
  [K in keyof _FlipProperties<T>]: _FlipProperties<T>[K];
} & {};
