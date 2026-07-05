// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../../node_modules/@types/web/index.d.ts" preserve="true" />

import type { MAIN_NS, DereferenceKey } from "./_namespaces";

export const _ = globalThis;

export const $ = new Proxy({}, { get: () => _ }) as any as {
  [NS in keyof MAIN_NS]: { [K in MAIN_NS[NS][number]]: DereferenceKey<K> };
};

export default $;
