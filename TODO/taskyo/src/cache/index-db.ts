import { TODO } from "jsyoyo/TODO";
import { CacheService, CACHE } from "./main";

// @ts-expect-error SEE ./memory.ts
declare module "taskyo" {
  interface CacheRegistry {
    index_db: CacheService;
  }
}

const $ = {
  get: TODO,
  set: TODO,
  clear: TODO,
} as CacheService;

CACHE.register("index_db", $);

export default $;
