// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../node_modules/@types/web/index.d.ts" preserve="true" />

import { RemoveUpperCase } from "./_types";

export const raw = globalThis;

export type T = RemoveUpperCase<typeof globalThis>;

const t: T = 1 as any;

export default raw as T;
