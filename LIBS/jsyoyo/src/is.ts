export const is_str = (x: unknown) => typeof x === "string";
export const is_num = (x: unknown) => typeof x === "number";
export const is_big = (x: unknown) => typeof x === "bigint";
export const is_bool = (x: unknown) => typeof x === "boolean";
export const is_sym = (x: unknown) => typeof x === "symbol";
export const is_fun = (x: unknown) => typeof x === "function";

export const is_obj = (x: unknown) => typeof x === "object" && x !== null;
export const is_arr = (x: unknown) => Array.isArray(x);
