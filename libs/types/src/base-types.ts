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
 * Curried function to its output
 */
export type Fn$O_Recursive<F> = F extends Fn<any, infer O> ? Fn$O_Recursive<O> : F;

export type IfEquals<X, Y, A = X, B = never> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

export type WritableKeys<T> = {
  [K in keyof T]-?: IfEquals<{ [P in K]: T[P] }, { -readonly [P in K]: T[P] }, K>;
}[keyof T];
