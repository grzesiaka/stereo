import "taskyo/cache/memory";
import "taskyo/cache/index-db";

import { task, CACHE } from "taskyo";

console.log(CACHE.registry);

const t = task.$<1, 2>(() => 2)({
  Id: "",
  cache: {
    key: (p, d) => `${p}`,
    store: "memory",
    ttl: 1,
  },
});
