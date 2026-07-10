export type Union$ObjectByKey<T, KEY extends PropertyKey> = {
  [X in T as X extends { [K in KEY]: infer NEW_KEY extends PropertyKey } ? NEW_KEY : never]: X;
};

export type Union$ObjectById<T, Id extends PropertyKey = "id" | "Id" | "ID"> = Union$ObjectByKey<T, Id>;

export type Union$ObjectByTagAndKey<T, TAG extends PropertyKey, KEY extends PropertyKey> = {
  // [TAG_VAL in T[TAG & keyof T] & PropertyKey]: BY_KEY<Extract<T, { [t in TAG]: TAG_VAL }>, KEY>;
  [t in T as t extends { [tk in TAG]: infer TAG_VAL extends string } ? TAG_VAL : never]: t extends {
    [tk in TAG]: infer TAG_VAL extends string;
  }
    ? Union$ObjectByKey<Extract<T, { [t in TAG]: TAG_VAL }>, KEY>
    : never;
};
