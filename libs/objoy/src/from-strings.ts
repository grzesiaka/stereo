export type ObjectFromStrings<T> = string[] extends T
  ? { [k: string]: string }
  : T extends readonly [infer H extends string, ...infer R]
    ? { [k in H]: H } & ObjectFromStrings<R>
    : {};

export const fromStrings = <const T extends readonly string[]>(keys: T) =>
  keys.reduce((a, k) => ((a[k] = k), a), {} as any) as ObjectFromStrings<T>;
