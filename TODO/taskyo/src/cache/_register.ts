import { Dict } from "jsyoyo";
import { CacheRegistry, CacheService } from "./main";

export const registry = {} as CacheRegistry & Dict<CacheService>;

export const register = (key: string, srv: CacheService) => (registry[key] = srv);
