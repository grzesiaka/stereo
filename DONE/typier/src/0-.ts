export type ResolveKey<$KEY extends string, $NEW_KEY extends string> = $NEW_KEY extends `?`
  ? $KEY extends `?${string}`
    ? $KEY
    : `?${$KEY}`
  : $NEW_KEY;

export const resolveKey = <$KEY extends string, $NEW_KEY extends string>(key: $KEY, newKey: $NEW_KEY) =>
  newKey === "?" ? (key[0] === "?" ? key : `?${key}`) : newKey;
