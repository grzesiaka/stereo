import { CacheService, CACHE } from "../cache";
import { __, Dict, es, MsOrNumber } from "jsyoyo";

const cfg = CACHE.config();
const $: CacheService & { $$: Dict<[MsOrNumber | __, unknown]> } = {
  $$: {} as Dict<[MsOrNumber, unknown]>,
  get: (k, p) => {
    const v: any = $.$$[`${p}${k}`];
    if (v) {
      if (!v[0] || v[0] >= cfg.now()) return v[1] as unknown;
      delete $.$$[k];
    }
    return __;
  },
  set: (k, v, p, t) => {
    t = t === 0 ? cfg.ttl : t;
    $.$$[`${p}${k}`] = [t && t + cfg.now(), v];
    return v;
  },
  clear: (staleOnly) => {
    if (!staleOnly) return ($.$$ = {});
    const now = cfg.now();
    es($.$$).reduce(
      (a, [k, v]) => {
        if (!v[0] || v[0] >= now) a[k] = v;
        return a;
      },
      {} as Dict<[MsOrNumber | __, unknown]>,
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
