import { __, ARR, dethunk } from "jsyoyo";
import { Remove, remove } from "arryo";
import { ERRs } from "rrerrorr";
import { Tree, Dethunk, awaiT } from "treeo";

type INIT = Tree<() => Promise<unknown>>;
type INIT$CTX<I extends __<INIT>> = __ extends I ? __ : Dethunk<I>;

type ERR_COMPAT = Error | { $: Error };
type ERR_SPEC = ARR<ERR_COMPAT>;

export const init = awaiT.$(dethunk) as <T extends INIT>(d: T) => INIT$CTX<T>;

type SPEC$RunFn<Params = unknown, Err extends __<ERR_SPEC> = __, Ctx = __> = (
  ...args: Remove<[params: Params, ctx: Ctx, err: Err], __>
) => unknown;

export interface SPEC<Params = unknown, Err extends __<ERR_SPEC> = __, Init extends __<INIT> = __> {
  init?: Init;
  ctx?: INIT$CTX<Init>;
  params?: Params;
  err?: Err;
  run?: SPEC$RunFn<Params, Err, INIT$CTX<Init>>;
}

export const spec = <S extends SPEC>(s: S) => s;

const s = spec({ a: 1, params: {} as { a?: 1 }, run: (a) => 1 });
const r = null as any as SPEC$RunFn<typeof s>;

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

ERR.retry();

ERR.timeout(1);
