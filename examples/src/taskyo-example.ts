// oxlint-disable no-undef

// import "taskyo/cache/index-db";

import "taskyo/cache/memory";
import { task, CACHE } from "taskyo";
import type { CacheRegistry } from "taskyo";

const r = {} as CacheRegistry;

const t = task.$<1, 2>(() => 2)({
  Id: "",
  cache: {
    key: (p, d) => `${p}`,
    store: "memory",
    ttl: 1,
  },
});

console.log(CACHE.registry as CacheRegistry, t);
