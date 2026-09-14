import { __, ARR, Dict, Fn, Fn$O } from "~types";

// sEmit - 's' / 'small' | TODO 'm' - matching by prefix; solo-mode when registering return updated self with register names removed

export type OnOff<Events extends Dict<ARR> = Dict<ARR>> = Fn$O<typeof sEmit<Events>>["$"];

export const sEmit = <Events extends Dict<ARR>>(CBs = {} as Partial<Dict<Set<Fn>, keyof Events>>) => {
  const off = <Key extends keyof Events>(key: Key, cb: (...ev: Events[Key]) => void) => {
    CBs[key]?.delete(cb);
    if (CBs[key]?.size === 0) delete CBs[key];
  };
  const on = <Key extends keyof Events>(
    key: Key,
    cb: (...ev: Events[Key]) => void,
    _opt?: boolean | { once?: boolean },
  ) => {
    CBs[key] = CBs[key] || new Set();
    CBs[key].add(cb);
    // return () => off(key, cb) as __<() => void>;
  };
  const $ = {
    CBs,
    emit: <Key extends keyof Events>(key: Key, ...ev: Events[Key]) => $.CBs[key]?.forEach((c) => c(...ev)),
    $: {
      on,
      off,
      addEventListener: on,
      removeEventListener: off,
    },
  };
  return $;
};
