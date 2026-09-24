import type { AbortSignal } from "jsyoyo";

export const fakeAbort = new Proxy({} as any, { get: () => () => 1 }) as AbortSignal;
