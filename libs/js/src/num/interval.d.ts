import type { Tagged } from "type-fest";
export type IntervalTagMeta<From extends number, To extends number, ToSymbol extends "]" | ")" = ")", By extends string | number = "", FromSymbol extends "[" | ")" = "["> = `${FromSymbol}${From}.${By}.${To}${ToSymbol}`;
export declare const $clamp: <K extends PropertyKey>() => <Min extends number, Max extends number>(min: Min, max: Max) => <V extends number>(val: V) => Tagged<V, K, IntervalTagMeta<Min, Max, "]">>;
export declare const clamp: <Min extends number, Max extends number>(min: Min, max: Max) => <V extends number>(val: V) => Tagged<V, "clamped", `[${Min}..${Max}]`>;
//# sourceMappingURL=interval.d.ts.map