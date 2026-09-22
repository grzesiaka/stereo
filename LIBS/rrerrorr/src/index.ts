import { __, ARR, dethunk, dp, Fn, Fn$O, is_str, Join } from "jsyoyo";
import { map, Tree } from "treeo";

export type RRERRORR<N extends string, Ctx extends ARR = ARR> = Error & { readonly name: N; readonly ctx: Ctx };

export interface RRERRORR$<N extends string = string, cCtx extends ARR = ARR> {
  new <Ctx extends cCtx>(...args: Ctx): RRERRORR<N, Ctx>;

  readonly name: N;
  readonly prototype: RRERRORR<N>;
}

export const ERR = <N extends string = string, cCtx extends ARR = ARR>(n: N) => {
  class _RRERRORR<const Ctx extends cCtx> extends Error {
    override readonly name = n;
    constructor(...ctx: Ctx) {
      super(is_str(ctx[0]) ? ctx[0] : n);
    }
    is(x: unknown): x is _RRERRORR<Ctx> {
      return x instanceof _RRERRORR;
    }
  }
  return dp(_RRERRORR, { name: n }) as never as RRERRORR$<N, cCtx>;
};

export type ERR<N extends string = string, cCtx extends ARR = ARR<any>> = Fn$O<typeof ERR<N, cCtx>>;

export const $ERR =
  <cCtx extends ARR>() =>
  <N extends string>(name: N) =>
    ERR<N, cCtx>(name);

type Txt = string | number;
export type $ERRs<DEF, P extends Txt[] = []> = DEF extends Fn
  ? ERR<Join<P, ".">, Fn$O<DEF> extends ERR<string, infer A> ? A : []>
  : DEF extends Txt
    ? ERR<Join<[...P, DEF], ".">, []>
    : DEF extends { readonly [k in Txt]: any }
      ? { [k in keyof DEF & Txt]: $ERRs<DEF[k], [...P, k]> }
      : never;

type ERR_DEF = string | ((n: string) => ERR) | (() => (n: string) => ERR);
export const ERRs = <const DEF extends Tree<ERR_DEF>>(def: ($: typeof $ERR) => DEF) =>
  map(([v, k]: [ERR_DEF, string]) => ERR(`${k}:${typeof v === "string" ? v : dethunk(v)(k)}`))(
    // @ts-expect-error no clue about root cause >> Type 'Tree<ERR_DEF>' is not assignable to type 'string'.ts(2345)
    def($ERR),
  ) as $ERRs<DEF>;

export default ERRs;
