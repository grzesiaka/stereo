import { id } from "jsyoyo";

interface AbortEvent {
  readonly type: "abort";
  readonly target: AbortSignal;
}

type AbortListener = (event: AbortEvent) => void;

export interface AbortSignal {
  readonly aborted: boolean;
  readonly reason: unknown;

  addEventListener(type: "abort", listener: AbortListener, options?: boolean | { once?: boolean }): void;

  removeEventListener(type: "abort", listener: AbortListener): void;

  throwIfAborted(): void;
}

interface AbortController {
  readonly signal: AbortSignal;
  abort(reason?: unknown): void;
}

export declare const AbortController: {
  new (): AbortController;
};

export const NEVER = new Promise(id);
