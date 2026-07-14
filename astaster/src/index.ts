import { ARR, Fn$O, Dict, Fn1, Fn$I } from "~types";

export type TagParam<Tag extends string = string, Param = unknown> = readonly [Tag, Param];
export type TagParam$Map<TG extends TagParam> = TG extends readonly [infer T extends string, infer P]
  ? { [K in T]: <Param extends P>(param: Param) => unknown }
  : never;

export type AST<TagParams extends TagParam = TagParam> =
  | TagParams
  | (() => TagParams)
  // TODO: investigate and if needed report as TS error `readonly [...TagParams, ARR<AST<TagParams>]` results in circular dependency
  //       `[TagParams[0], TagParams[1], ARR<AST<TagParams>>]` is too loose on its own
  | (readonly [TagParams[0], TagParams[1], ARR<AST<TagParams>>] & readonly [...TagParams, unknown]);

export type ApplyMapByTag<Tag, Map, AST> = Tag extends keyof Map ? Fn$O<Map[Tag]> : AST;

export type MapASTArr<AST, Map> = AST extends readonly [infer H, ...infer R]
  ? [MapAST<H, Map>, ...MapASTArr<R, Map>]
  : [];

export type MapAST<AST, Map> = AST extends readonly [infer Tag extends string, any]
  ? ApplyMapByTag<Tag, Map, AST>
  : AST extends readonly [infer Tag extends string, any, infer R]
    ? [ApplyMapByTag<Tag, Map, AST>, MapASTArr<R, Map>]
    : AST extends (...k: any[]) => [infer Tag extends string, any, any?]
      ? MapAST<[Tag, any], Map>
      : AST extends ARR
        ? MapASTArr<AST, Map>
        : never;

export type TaggedMap = Dict<Fn1<never>>;
export type Map$TagParam<S extends TaggedMap> = { [K in keyof S & string]: TagParam<K, Fn$I<S[K]>[0]> }[keyof S &
  string];
export interface Astaster<TPs extends TagParam, S extends TaggedMap> {
  <const ASt extends AST<TPs> | ARR<AST<TPs>>>(ast: ASt): MapAST<ASt, S>;
  ast: <nTPs extends TagParam>() => Astaster<TPs | nTPs, S>;
  aster: <N extends TagParam$Map<TPs>>(N: N) => Astaster<TPs, S & N>;
  MAP: S;
}
export type Astaster$TagParam<A> = A extends Astaster<infer TP, any> ? TP : never;
export type Astaster$Map<A> = A extends Astaster<[any, any], infer Map> ? Map : never; // any does not work; [any, any] is fine; wtf?

export type Astaster$Unhandled<A> = Exclude<Astaster$TagParam<A>, readonly [keyof Astaster$Map<A>, any]>;

export type Mapped<TP extends TagParam, M extends TaggedMap> =
  | { [K in keyof M]: Fn$O<M[K]> }[keyof M]
  | Exclude<TP, readonly [keyof M, any]>;

export const $astaster =
  <TPs extends TagParam>() =>
  <
    Map extends TagParam$Map<TPs>,
    Reduce extends (current: Mapped<TPs, Map>, kids: Mapped<TPs, Map>, acc: NoInfer<Acc>) => void,
    Acc = {},
  >(
    map: Map,
    reduce?: Reduce,
    acc = () => ({}) as () => Acc,
  ): Astaster<TPs, Map> => {
    const a: Astaster<TPs, Map> = (ast) => {
      return 1 as any;
    };
    a.ast = () => a;
    a.aster = (map) => ({ ...a.MAP, ...map }) as any;
    a.MAP = map;
    return a;
  };

export const astaster = <S extends TaggedMap, TG extends TagParam = Map$TagParam<S>>(map: S) =>
  $astaster<TG>()(map as any) as Astaster<TG, S>;

const dd = { abc: (s: string) => s } satisfies TaggedMap;
type TGdd = Map$TagParam<typeof dd>;
const st = astaster(dd)(["abc", "abc", [["abc", ""]]]);

type testTP = ["str", string] | ["num", number];

const a = $astaster<testTP>()({ num: (x) => x + x })
  .ast<["abc", number]>()
  .aster({ str: (x) => [x, x] as [typeof x, typeof x], abc: (x) => `abc_${x}` as const });

type TagParams = Astaster$TagParam<typeof a>;
type tMap = Astaster$Map<typeof a>;

const x = a([
  "num",
  1,
  [
    ["num", 2],
    ["str", "str!"],
    ["abc", 1],
  ],
]);

const z = $astaster<["a", undefined] | ["b", 1]>()({ a: () => "a" });
type UnZ = Astaster$Unhandled<typeof z>;

const y = a([]);
