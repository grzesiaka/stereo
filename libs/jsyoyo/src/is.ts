export const str = (x: unknown) => typeof x === "string";
export const num = (x: unknown) => typeof x === "number";
export const big = (x: unknown) => typeof x === "bigint";
export const bool = (x: unknown) => typeof x === "boolean";
export const sym = (x: unknown) => typeof x === "symbol";
export const fun = (x: unknown) => typeof x === "function";

export const obj = (x: unknown) => typeof x === "object" && x !== null;
export const arr = (x: unknown) => Array.isArray(x);
