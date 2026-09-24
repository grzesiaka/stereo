import { __, ARR, dethunk, Json } from "jsyoyo";
// import { Remove, remove } from "arryo";
import { ERRs } from "rrerrorr";
import { Tree, Dethunk, awaiT, AwaiTreed } from "treeo";

type ERR_COMPAT = Error | { $: Error };
type ERR_SPEC = ARR<ERR_COMPAT>;

type INIT = Tree<Json | (() => Json) | (() => Promise<unknown>)> & { ERR?: () => Promise<ERR_SPEC> };
type INIT$CTX<I extends __<INIT>> = __ extends I ? __ : AwaiTreed<Dethunk<I>>;

export const init = awaiT.$(dethunk) as <T extends INIT>(d: T) => INIT$CTX<T>;

export interface SPEC<Params = unknown, Init extends __<INIT> = __> {
  init?: Init;
  ctx?: INIT$CTX<Init>;
  params?: Params;
  run?: (params: NoInfer<Params>, ctx: INIT$CTX<Init>) => unknown;
}

export const spec = <S extends SPEC>(s: S) => s;

export interface RUN<S extends SPEC> {
  spec: S;
}

export const ERR = ERRs(($) => ({
  taskyo: {
    err: {
      retry: $,
      abort: $(),
      timeout: $<[how_long: number]>(),
      critical: $,
    },
  },
}))["taskyo"]["err"];
