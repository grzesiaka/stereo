import { __, a, MsOrNumber } from "jsyoyo";
import { Json } from "~types";

let _config = {
  prefix: `${Date.now()}`, // init to _unique_ value to reduce potential harm
  now: () => Date.now() as MsOrNumber,
  ttl: __ as __<MsOrNumber>,
} satisfies SharedCacheConfig;

const config = (cfg?: Partial<SharedCacheConfig>): SharedCacheConfig => (!cfg ? _config : (_config = a(_config, cfg)));

const registry = {} as CacheRegistry;

const register = (key: string, srv: CacheService) => ((registry as any)[key] = srv);

export const CACHE = {
  config,
  register,
  registry,
};

export interface CacheService {
  get: (key: string, withPrefix?: boolean) => Promise<Json> | Json;
  set: (key: string, value: Json, withPrefix?: boolean, ttl?: MsOrNumber) => Promise<Json> | Json;
  clear: (staleOnly?: boolean) => Promise<unknown> | unknown;
}

export interface SharedCacheConfig {
  /**
   * Prefix for keys (for example: a `user-id` / `hash(user-id)`) to create a namespace.
   * Set once globally, so no need to pass it to each task separately.
   */
  prefix: string;
  /**
   * Time to live
   */
  ttl: __<MsOrNumber>;
  /**
   * @returns Current time (needed for ttl)
   */
  now: () => number;
}

type Prefix = __<string>;
type TTL = MsOrNumber;
export interface CacheOption {
  /**
   * `undefined` or not set - use globally defined
   * `""` - off
   * `string` - use it as prefix
   */
  prefix?: Prefix;
  /**
   * `undefined` - ignore / Infinity,
   * `0` - use global,
   * `number` (milliseconds) - use that number
   */
  ttl?: TTL;
}

/**
 * Registry to be augmented by importing concrete cache services (local-storage, in-memory, fs, index-db).
 */
export interface CacheRegistry {}

type _CacheStores = {
  [K in keyof CacheRegistry as CacheRegistry[K] extends CacheService ? K : never]: CacheOption;
};

export type CacheStore = keyof _CacheStores;
