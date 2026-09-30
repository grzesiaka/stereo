import { CacheService, CACHE } from "../cache";
import { __, MsOrNumber } from "jsyoyo";

import * as idb from "idb-keyval";

const cfg = CACHE.config();

type Entry = [expiresAt: MsOrNumber | null, value: unknown];

const store = idb.createStore("taskyo", "cache");

const $: CacheService = {
  get: async (k, p) => {
    const key = `${p}${k}`;
    const entry = await idb.get<Entry>(key, store);
    if (!entry) return __;

    const [expiresAt, value] = entry;
    if (expiresAt === null || expiresAt >= cfg.now()) return value;

    await idb.del(key, store);
    return __;
  },

  set: async (k, value, p, t) => {
    t = t === 0 ? cfg.ttl : t;
    const entry: Entry = [t ? cfg.now() + t : null, value];

    await idb.set(`${p}${k}`, entry, store);
    return value;
  },

  clear: async (staleOnly) => {
    if (!staleOnly) return idb.clear(store);

    const now = cfg.now();
    const entries = await idb.entries<string, Entry>(store);

    const staleKeys = entries.filter(([, [expiresAt]]) => expiresAt !== null && expiresAt < now).map(([key]) => key);

    await idb.delMany(staleKeys, store);
  },
};

// @ts-expect-error It seems to be limitation of typescript; ideally module path should be relative
declare module "taskyo" {
  interface CacheRegistry {
    index_db: CacheService;
  }
}

CACHE.register("index_db", $);

export default $;
