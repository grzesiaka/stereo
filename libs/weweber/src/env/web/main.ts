import type { MAIN_NS, DereferenceKey } from "./_namespaces";

export const _ = globalThis;

export const web = new Proxy({}, { get: () => _ }) as any as {
  [NS in keyof MAIN_NS]: { [K in MAIN_NS[NS][number]]: DereferenceKey<K> };
} & { _: typeof globalThis };

export default web;
