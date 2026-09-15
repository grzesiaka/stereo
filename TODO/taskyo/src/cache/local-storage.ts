import { CacheService } from "./main";

declare module "./_register" {
  interface CacheRegistry {
    local_storage: CacheService;
  }
}

export default "TODO-local-storage";
