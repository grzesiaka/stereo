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
