// oxlint-disable no-undef
import { CacheService, CACHE } from "./main";
import { __, MsOrNumber } from "jsyoyo";

declare const localStorage: {
  getItem(key: string): null | string;
  setItem(key: string, item: string): void;
  removeItem(key: string): void;
  key(index: number): null | string;
  length: number;
};

const parse = (raw: string) => {
  const x = JSON.parse(raw);
  return x && x.length === 2 && (!x[0] || typeof x[0] === "number") ? (x as [MsOrNumber | null, unknown]) : null;
};

const cfg = CACHE.config();
const $: CacheService = {
  get: (k, p) => {
    const key = `${p}${k}`;
    const raw = localStorage.getItem(key);
    if (raw === null) return __;

    const v = parse(raw);
    if (v && (v[0] === null || v[0] >= cfg.now())) return v[1];

    localStorage.removeItem(key);
    return __;
  },

  set: (k, value, p, t) => {
    t = t === 0 ? cfg.ttl : t;
    const expiresAt = t ? cfg.now() + t : null;
    localStorage.setItem(`${p}${k}`, JSON.stringify([expiresAt, value]));
    return value;
  },

  clear: (staleOnly) => {
    const now = cfg.now();

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)!;

      if (staleOnly) {
        const raw = localStorage.getItem(key);
        const v = raw && parse(raw);
        if (v && (v[0] === null || v[0] >= now)) continue;
      }

      localStorage.removeItem(key);
    }
  },
};

CACHE.register("local_storage", $);

// @ts-expect-error It seems to be limitation of typescript; ideally module path should be relative
declare module "taskyo" {
  export interface CacheRegistry {
    local_storage: CacheService;
  }
}

export default $;
