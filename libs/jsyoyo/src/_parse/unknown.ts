export const str = (x: unknown) => (typeof x === "string" ? x : undefined);
export const num = (x: unknown) => (typeof x === "number" ? x : undefined);
export const big = (x: unknown) => (typeof x === "bigint" ? x : undefined);
export const bool = (x: unknown) => (typeof x === "boolean" ? x : undefined);
export const sym = (x: unknown) => (typeof x === "symbol" ? x : undefined);
export const fun = (x: unknown) => (typeof x === "function" ? x : undefined);

export const obj = (x: unknown) => (typeof x === "object" && x !== null ? x : undefined);
export const arr = (x: unknown) => (Array.isArray(x) ? (x as unknown[]) : undefined);
