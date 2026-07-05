export type RemoveUpperCase<T> = {
  [K in keyof T as K extends string ? (K extends Capitalize<K> ? never : K) : K]: T[K];
};

// export type
