import { OnOff, sEmit } from "../s-emitter";

interface AbortEvent {
  readonly type: "abort";
  readonly target: AbortSignal;
  readonly reason?: unknown;
}

type Events = { abort: [AbortEvent] };

export type AbortSignal = Omit<OnOff<Events>, "on" | "off"> & {
  readonly aborted?: boolean;
  readonly reason?: unknown;
  throwIfAborted?(): void;
};

interface _AbortController {
  readonly signal: AbortSignal;
  abort(reason?: unknown): void;
}

export class AbortError<Reason = unknown> extends Error {
  constructor(
    public readonly reason: Reason,
    public readonly signal: AbortSignal,
  ) {
    super("abort");
  }
}

export class AbortController implements _AbortController {
  #$ = sEmit<Events>();
  signal: AbortSignal;
  constructor() {
    this.signal = this.#$.$;
  }
  abort(reason?: unknown) {
    // @ts-expect-error readonly write
    this.signal.aborted = true;
    this.#$.emit("abort", { target: this.signal, type: "abort", reason });
  }
}

export default AbortController;
