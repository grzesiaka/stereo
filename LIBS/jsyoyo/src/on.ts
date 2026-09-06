import { Fn$I } from "~types";
import { id } from "./id";
import { OnOff } from "./s-emitter";

export const ON =
  <T extends Partial<OnOff>>(t: T) =>
  <KV extends Fn$I<T["on"]>>(...kv: KV) =>
    // (...kv) OR EVEN (...(kv as any[]) DO NOT WORK
    (
      (t.on || t.addEventListener || (() => 1))(kv[0], kv[1]),
      () => (t.off || t.removeEventListener || id)(kv[0], kv[1])
    );

export default ON;
