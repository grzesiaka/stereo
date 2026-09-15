import { CacheService } from "./main";

declare module "./_register" {
  interface CacheRegistry {
    index_db: CacheService;
  }
}

export default "TODO-index-db";
