import { TODO } from "jsyoyo/TODO";
import { CACHE, CacheService } from "./main";

// @ts-expect-error SEE ./memory.ts
declare module "taskyo" {
  interface CacheRegistry {
    local_storage: CacheService;
  }
}

const $ = {
  get: TODO,
  set: TODO,
  clear: TODO,
} as CacheService;

CACHE.register("local_storage", $);
