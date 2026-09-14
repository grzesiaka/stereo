// oxlint-disable no-undef
import { __ } from "./deps";
import ON from "./on";
import { AbortSignal, AbortError } from "./polyfills/AbortController";

declare const setTimeout: (cb: () => void, after: number) => unknown;
declare const clearTimeout: (t: unknown) => void;

declare const setInterval: (cb: () => void, after: number) => unknown;
declare const clearInterval: (t: unknown) => void;

export const timeout = (ms: number, cb: () => void) => {
  const t = setTimeout(cb, ms);
  return () => clearTimeout(t);
};

export const interval = (ms: number, cb: () => void) => {
  const t = setInterval(cb, ms);
  return () => clearInterval(t);
};

export const wait = <Ms extends number = 0, const Value = __>(
  ms = 0 as Ms,
  value = __ as Value,
  abortSignal?: AbortSignal,
): Promise<Value> => {
  if (!abortSignal) return new Promise((res) => setTimeout(() => res(value), ms));
  return Promise.race([
    wait(ms, value),
    ON.promise(abortSignal)("abort").then((ev) => Promise.reject(new AbortError(ev, abortSignal))),
  ]);
};

export const tick = (n = 1): Promise<void> => (n <= 1 ? Promise.resolve() : tick(n - 1).then(() => Promise.resolve()));
