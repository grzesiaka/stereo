import { __, a, MsOrNumber, Tagged } from "jsyoyo";
import { Json } from "~types";
import { register, registry } from "./_register";

let _config = {
  prefix: __ as __<string>,
  now: () => Date.now() as MsOrNumber,
  ttl: __ as __<MsOrNumber>,
} satisfies SharedCacheConfig;

const config = (cfg?: Partial<SharedCacheConfig>): SharedCacheConfig => (!cfg ? _config : (_config = a(_config, cfg)));

export const cache = {
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

type Prefix = Tagged<__<boolean>, `include-prefix?`, [__<false>, "no"] | [true, "yes"]>;
type TTL = Tagged<
  MsOrNumber,
  `time-to-live`,
  [__, "ignored / infinity"] | [0, "use global (if set)"] | [Exclude<MsOrNumber, 0>, "use this value"]
>;

export interface CacheOption {
  /** Use globally defined prefix. `undefined | false` to ignore global prefix. (default / missing: `true`) */
  prefix?: Prefix;
  /** `undefined` - ignore / Infinity, `0` - use global, `number` (ms) - use that number  */
  ttl?: TTL;
}

/**
 * Registry to be augmented by importing concrete cache services (local-storage, in-memory, fs, index-db).
 */
export interface CacheRegistry {}

export type CacheOptions = { [K in keyof CacheRegistry]: CacheOptions };
