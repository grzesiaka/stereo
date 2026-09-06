import { ARR, Dict, Fn, Fn$O } from "~types";

// sEmit - 's' / 'small' | TODO 'm' - matching by prefix; solo-mode when registering return updated self with register names removed

export type OnOff<Events extends Dict<ARR> = Dict<ARR>> = Fn$O<typeof sEmit<Events>>["$"];

export const sEmit = <Events extends Dict<ARR>>(cbs = {} as Partial<Dict<Set<Fn>, keyof Events>>) => {
  const off = <Key extends keyof Events>(key: Key, cb: (...ev: Events[Key]) => void) => {
    cbs[key]?.delete(cb);
    if (cbs[key]?.size === 0) delete cbs[key];
  };
  const on = <Key extends keyof Events>(key: Key, cb: (...ev: Events[Key]) => void) => {
    cbs[key] = cbs[key] || new Set();
    cbs[key].add(cb);
    return () => off(key, cb);
  };
  return {
    listners: cbs,
    emit: <Key extends keyof Events>(key: Key, ...ev: Events[Key]) => cbs[key]?.forEach((c) => c(...ev)),
    $: {
      on,
      off,
      addEventListener: on,
      removeEventListener: off,
    },
  };
};
