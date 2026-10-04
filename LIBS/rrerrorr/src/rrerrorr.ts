import { __, dethunk, dp, Fn, Fn$O, Join, a } from "jsyoyo";
import { map, Tree } from "treeo";

export type RRERRORR<N extends string, Data extends object> = Error &
  Data & {
    readonly name: N;
  };

export interface RRERRORR$<N extends string = string, cData extends object = {}> extends Error {
  new <Data extends cData>(...CTX: __ | unknown extends Data ? [Data?] : [Data]): RRERRORR<N, Data>;
  readonly name: N;
  readonly prototype: RRERRORR<N, cData>;
}

export const ERR = <N extends string = string, cData extends object = {}>(n: N) => {
  class _RRERRORR<const Data extends cData> extends Error {
    override readonly name = n;
    constructor(data: Data) {
      super();
      a(this, data);
    }
    is(x: Error): x is _RRERRORR<Data> {
      return x instanceof _RRERRORR || x.name === this.name;
    }
  }
  return dp(_RRERRORR, { name: n }) as never as RRERRORR$<N, cData>;
};

export type ERR<N extends string = string, cData extends object = {}> = Fn$O<typeof ERR<N, cData>>;

export const $ERR =
  <cData extends object = {}>() =>
  <N extends string>(name: N) =>
    ERR<N, cData>(name);

type Txt = string | number;
export type $ERRsRaw<DEF, P extends Txt[] = []> = DEF extends Fn
  ? ERR<
      Join<[...P], ".">,
      Fn$O<DEF> extends ERR<string, infer A> ? A : Fn$O<Fn$O<DEF>> extends ERR<string, infer A> ? A : {}
    >
  : DEF extends Txt
    ? ERR<Join<[...P, DEF], ".">, {}>
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
      ...CTX: {} extends CTX ? [CTX?] : [CTX]
    ) => RRERRORR<T extends { name: string } ? T["name"] : never, CTX>) & {
      $: T;
      is: (e: unknown) => e is InstanceType<T>;
    }
  : { [K in keyof T & Txt]: Declassify<T[K], [...P, K]> };
