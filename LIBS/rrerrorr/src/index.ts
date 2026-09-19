import { __, ARR, dp, Fn, Fn$O, is_str, Join } from "jsyoyo";
import { map, Tree } from "treeo";

export const ERR = <N extends string, cCtx extends ARR = [string?]>(n: N) => {
  class RRERRORR<Ctx extends cCtx> extends Error {
    override readonly name = n;
    constructor(...ctx: Ctx) {
      super(is_str(ctx[0]) ? ctx[0] : n);
    }
    static is(x: unknown): x is RRERRORR<any> {
      return x instanceof RRERRORR;
    }
    is(x: unknown): x is RRERRORR<Ctx> {
      return x instanceof RRERRORR;
    }
  }
  return dp(RRERRORR, { name: n });
};

export type ERR<N extends string = string, cCtx extends ARR = ARR> = Fn$O<typeof ERR<N, cCtx>>;

export const $ERR =
  <cCtx extends ARR = [string?]>() =>
  <N extends string>(name: N) =>
    ERR<N, cCtx>(name);

type Txt = string | number;
export type $ERRs<DEF, P extends readonly Txt[] = []> = DEF extends Fn
  ? ERR<Join<P, ".">, Fn$O<DEF> extends ERR<string, infer A> ? A : []>
  : DEF extends Txt
    ? ERR<Join<[...P, DEF], ".">, []>
    : DEF extends { readonly [k in Txt]: any }
      ? { [k in keyof DEF & Txt]: $ERRs<DEF[k], [...P, k]> }
      : never;

export const ERRs = <const DEF extends Tree<string | ((n: string) => ERR)>>(def: ($: typeof $ERR) => DEF) =>
  map(([v, k]) => ERR(`${k}:${v}`))(def) as $ERRs<DEF>;
