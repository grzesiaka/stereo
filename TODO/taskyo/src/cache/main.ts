import { __, a, MsOrNumber } from "jsyoyo";
import { Json } from "~types";

let _config = {
  prefix: __ as __<string>,
  now: () => Date.now() as MsOrNumber,
  ttl: __ as __<MsOrNumber>,
} satisfies SharedCacheConfig;

export const config = (cfg?: Partial<SharedCacheConfig>): SharedCacheConfig =>
  !cfg ? _config : (_config = a({}, _config, cfg));

export interface CacheService {
  get: (key: string, withPrefix?: boolean) => Promise<Json>;
  set: (key: string, value: Json, withPrefix?: boolean, ttl?: MsOrNumber) => Promise<Json>;
  clear: (staleOnly?: boolean) => Promise<void>;
}

export interface SharedCacheConfig {
  /**
   * Prefix for keys (for example: a `user-id` / `hash(user-id)`) to create a namespace.
   * Set once globally
   */
  prefix: __<string>;
  /**
   * Time to live
   */
  ttl: __<MsOrNumber>;
  /**
   * @returns Current time (needed for ttl)
   */
  now: () => number;
}

export interface CacheOption {
  /** Use globally defined prefix. `undefined | false` to ignore global prefix. (default / missing: `true`) */
  prefix?: __ | boolean;
  /** missing - Infinity, `undefined | 0` - use default, `number` (ms) - use that number  */
  ttl?: MsOrNumber;
}

/**
 * Registry to be augmented by importing concrete cache services (local-storage, in-memory, fs, index-db).
 */
export interface CacheRegistry {}

export type CacheOptions = { [K in keyof CacheRegistry]: CacheOptions };
