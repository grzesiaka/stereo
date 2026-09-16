import { CacheService, CACHE } from "./main";
import { __, Dict, es, Json, MsOrNumber } from "jsyoyo";

const cfg = CACHE.config();
const $: CacheService & { $$: Dict<[MsOrNumber | __, Json]> } = {
  $$: {} as Dict<[MsOrNumber, Json]>,
  get: (k, p) => {
    const v: any = $.$$[p ? `${cfg.prefix}${k}` : k];
    if (v) {
      if (!v[0] || v[0] <= cfg.now()) return v[1] as Json;
      delete $.$$[k];
    }
    return null;
  },
  set: (k, v, p, t) => {
    t = t === 0 ? cfg.ttl : t;
    $.$$[p ? `${cfg.prefix}${k}` : k] = [t && t + cfg.now(), v];
    return v;
  },
  clear: (staleOnly) => {
    if (!staleOnly) return ($.$$ = {});
    const now = cfg.now();
    es($.$$).reduce(
      (a, [k, v]) => {
        if (!v[0] || v[0] <= now) a[k] = v;
        return a;
      },
      {} as Dict<[MsOrNumber | __, Json]>,
    );
  },
};

CACHE.register("memory", $);

// @ts-expect-error It seems to be limitation of typescript; ideally module path should be relative
declare module "taskyo" {
  export interface CacheRegistry {
    memory: CacheService;
  }
}

export default $;
