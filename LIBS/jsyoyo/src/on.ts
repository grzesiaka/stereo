import { ARR, Dict } from "~types";
import { id } from "./id";
import { OnOff } from "./s-emitter";

export const ON =
  <Events extends Dict<ARR>, T extends Partial<OnOff<Events>> = Partial<OnOff<Events>>>(t: T) =>
  <Key extends keyof Events>(key: Key, cb: (...ev: Events[Key]) => void, opt?: boolean | { once?: boolean }) => (
    (t.on || t.addEventListener || (() => 1))(key, cb, opt),
    () => (t.off || t.removeEventListener || id)(key, cb)
  );

export default ON;
