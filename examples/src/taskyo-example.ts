import "taskyo/cache/memory";
// import "taskyo/cache/index-db";
import { task, CACHE } from "taskyo";
import type { CacheRegistry } from "taskyo";

console.log(CACHE.registry);

const r = {} as CacheRegistry;

r;

const t = task()(() => ({}), {
  cache: "memory",
});
