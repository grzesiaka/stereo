import { __, dethunk, dp, Fn, Fn$O, Join, a } from "jsyoyo";
import { map, Tree } from "treeo";

export type RRERRORR<N extends string, Ctx> = Error & {
  readonly name: N;
  readonly ctx: Ctx;
};

export interface RRERRORR$<N extends string = string, cCtx = unknown> extends Error {
  new <Ctx extends cCtx>(...CTX: __ | unknown extends Ctx ? [Ctx?] : [Ctx]): RRERRORR<N, Ctx>;
  readonly name: N;
  readonly prototype: RRERRORR<N, cCtx>;
}

export const ERR = <N extends string = string, cCtx = unknown>(n: N) => {
  class _RRERRORR<const Ctx extends cCtx> extends Error {
    override readonly name = n;
    constructor(public readonly ctx: Ctx) {
      super();
    }
    is(x: Error): x is _RRERRORR<Ctx> {
      return x instanceof _RRERRORR || x.name === this.name;
    }
  }
  return dp(_RRERRORR, { name: n }) as never as RRERRORR$<N, cCtx>;
};

export type ERR<N extends string = string, cCtx = unknown> = Fn$O<typeof ERR<N, cCtx>>;

export const $ERR =
  <cCtx = __<string>>() =>
  <N extends string>(name: N) =>
    ERR<N, cCtx>(name);

type Txt = string | number;
export type $ERRsRaw<DEF, P extends Txt[] = []> = DEF extends Fn
  ? ERR<
      Join<[...P], ".">,
      Fn$O<DEF> extends ERR<string, infer A> ? A : Fn$O<Fn$O<DEF>> extends ERR<string, infer A> ? A : __
    >
  : DEF extends Txt
    ? ERR<Join<[...P, DEF], ".">, unknown>
    : DEF extends { readonly [k in Txt]: any }
      ? { [k in keyof DEF & Txt]: $ERRsRaw<DEF[k], [...P, k]> }
      : never;

export type $ERRs<Def> = Declassify<$ERRsRaw<Def>>;

type ERR_DEF = string | ((n: string) => ERR) | (() => (n: string) => ERR);
export const ERRs = <const DEF extends Tree<ERR_DEF>>(def: ($: typeof $ERR) => DEF) =>
  map(([v, k]: [ERR_DEF, string]) => {
    const $ = typeof v === "string" ? ERR(`${k}.${v}`) : dethunk(v)(k);
    return a((ctx: any) => new $(ctx), {
      $,
      is: (e: unknown) => e instanceof $ /* for cross boundary: e instanceof Error && e.name = $.name */,
    });
  })(
    // @ts-expect-error no clue about root cause >> Type 'Tree<ERR_DEF>' is not assignable to type 'string'.ts(2345)
    def($ERR),
  ) as never as $ERRs<DEF>;

export type AsInstances<Es> = Es extends { $: AnyClass }
  ? InstanceType<Es["$"]>
  : {
      [K in keyof Es]: AsInstances<Es[K]>;
    };

export default ERRs;

type AnyClass = abstract new (...args: any[]) => unknown;

type Declassify<T, P extends Txt[] = []> = T extends AnyClass
  ? (<const CTX extends ConstructorParameters<T>[0]>(
      ...CTX: unknown extends CTX ? [CTX?] : [CTX]
    ) => RRERRORR<T extends { name: string } ? T["name"] : never, CTX>) & {
      $: T;
      is: (e: unknown) => e is InstanceType<T>;
    }
  : { [K in keyof T & Txt]: Declassify<T[K], [...P, K]> };
