type RemoveNoiseKey<K extends string> =
  K extends Capitalize<K> ? never : K extends `on${Lowercase<string>}` ? never : K;

export type RemoveNoise<T, OtherKeysToRemove = never> = {
  [K in keyof T & string as Exclude<RemoveNoiseKey<K>, OtherKeysToRemove>]: T[K];
};
