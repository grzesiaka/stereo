import type { Tagged } from "type-fest";

export type IntervalTagMeta<
  From extends number,
  To extends number,
  ToSymbol extends "]" | ")" = ")",
  By extends string | number = "",
  FromSymbol extends "[" | ")" = "[",
> = `${FromSymbol}${From}.${By}.${To}${ToSymbol}`;

export const $clamp =
  <K extends PropertyKey>() =>
  <Min extends number, Max extends number>(min: Min, max: Max) =>
  <V extends number>(val: V) =>
    Math.min(max, Math.max(min, val)) as Tagged<V, K, IntervalTagMeta<Min, Max, "]">>;

export const clamp = $clamp<"clamped">();
