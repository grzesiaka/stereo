import { __, ARR, dethunk, dp, Fn, Fn$O, Join, a } from "jsyoyo";
import { map, Tree } from "treeo";

export type RRERRORR<N extends string, Ctx extends ARR = readonly [string?]> = Error & {
  readonly name: N;
  readonly ctx: Ctx;
};

export interface RRERRORR$<N extends string = string, cCtx extends ARR = readonly [string?]> {
  new <Ctx extends cCtx>(...args: Ctx): RRERRORR<N, Ctx>;
  readonly name: N;
  readonly prototype: RRERRORR<N>;
}

export const ERR = <N extends string = string, cCtx extends ARR = readonly [string?]>(n: N) => {
  class _RRERRORR<const Ctx extends cCtx> extends Error {
    override readonly name = n;
    public readonly ctx: Ctx;
    constructor(...ctx: Ctx) {
      super();
      this.ctx = ctx;
    }
    is(x: Error): x is _RRERRORR<Ctx> {
      return x instanceof _RRERRORR || x.name === this.name;
    }
  }
  return dp(_RRERRORR, { name: n }) as never as RRERRORR$<N, cCtx>;
};

export type ERR<N extends string = string, cCtx extends ARR = readonly [string?]> = Fn$O<typeof ERR<N, cCtx>>;

export const $ERR =
  <cCtx extends ARR = readonly [string?]>() =>
  <N extends string>(name: N) =>
    ERR<N, cCtx>(name);

type Txt = string | number;
export type $ERRsRaw<DEF, P extends Txt[] = []> = DEF extends Fn
  ? ERR<
      Join<P, ".">,
      Fn$O<DEF> extends ERR<string, infer A>
        ? A
        : Fn$O<Fn$O<DEF>> extends ERR<string, infer A>
          ? ARR extends A
            ? [string?]
            : A
          : []
    >
  : DEF extends Txt
    ? ERR<Join<[...P, DEF], ".">, []>
    : DEF extends { readonly [k in Txt]: any }
      ? { [k in keyof DEF & Txt]: $ERRsRaw<DEF[k], [...P, k]> }
      : never;

export type $ERRs<Def> = Declassify<$ERRsRaw<Def>>;

type ERR_DEF = string | ((n: string) => ERR) | (() => (n: string) => ERR);
export const ERRs = <const DEF extends Tree<ERR_DEF>>(def: ($: typeof $ERR) => DEF) =>
  map(([v, k]: [ERR_DEF, string]) => {
    const $ = typeof v === "string" ? ERR(`${k}.${v}`) : dethunk(v)(k);
    return a((...args: ARR) => new $(...args), { $ });
  })(
    // @ts-expect-error no clue about root cause >> Type 'Tree<ERR_DEF>' is not assignable to type 'string'.ts(2345)
    def($ERR),
  ) as never as $ERRs<DEF>;

export default ERRs;

type AnyClass = abstract new (...args: any[]) => unknown;

type Declassify<T, P extends Txt[] = []> = T extends AnyClass
  ? (<const Args extends ConstructorParameters<T>>(
      ...args: Args & ConstructorParameters<T>
    ) => RRERRORR<Join<P, ".">, Args>) & { $: T }
  : { [K in keyof T & Txt]: Declassify<T[K], [...P, K]> };
