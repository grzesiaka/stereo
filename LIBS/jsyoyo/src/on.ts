import { Fn$I } from "~types";
import { id } from "./id";
import { OnOff } from "./s-emitter";

export const ON =
  <T extends OnOff & { addEventListener?: OnOff["on"]; removeEventListener?: OnOff["off"] }>(t: T) =>
  <KV extends Fn$I<T["on"]>>(...kv: KV) =>
    // (...kv) OR EVEN (...(kv as any[]) DO NOT WORK
    ((t.on || t.addEventListener || id)(kv[0], kv[1]), () => (t.off || t.removeEventListener || id)(kv[0], kv[1]));

export default ON;
