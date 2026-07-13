import { ARR, Fn$O, Dict, Fn1, Fn$I } from "~types";

export type TagParam<Tag extends string = string, Param = unknown> = readonly [Tag, Param];
export type TagParam$Ster<TG extends TagParam> = TG extends readonly [infer T extends string, infer P]
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

export type Ster = Dict<Fn1>;
export type Ster$TagParam<S extends Ster> = { [K in keyof S & string]: TagParam<K, Fn$I<S[K]>[0]> }[keyof S & string];
export interface Astaster<TPs extends TagParam, S extends Ster> {
  <const ASt extends AST<TPs> | ARR<AST<TPs>>>(ast: ASt): MapAST<ASt, S>;
  ast: <nTPs extends TagParam>() => Astaster<TPs | nTPs, S>;
  aster: <N extends TagParam$Ster<TPs>>(N: N) => Astaster<TPs, S & N>;
  ster: S;
}
export type Astaster$TagParam<A> = A extends Astaster<infer TP, any> ? TP : never;
export type Astaster$Ster<A> = A extends Astaster<[any, any], infer Ster> ? Ster : never; // any does not work; [any, any] is fine; wtf?

export const $astaster =
  <TPs extends TagParam>() =>
  <S extends Ster>(ster: S): Astaster<TPs, S> => {
    const a: Astaster<TPs, S> = (ast) => {
      return 1 as any;
    };
    a.ast = () => a;
    a.ster = ster;
    a.aster = (ster) => ({ ...a.ster, ...ster }) as any;
    return a;
  };

export const $ster = <S extends Ster>(ster: S) => $astaster<Ster$TagParam<S>>()(ster);

const dd = { abc: (s: string) => s } satisfies Ster;
type TGdd = Ster$TagParam<typeof dd>;
const st = $ster(dd)(["abc", "abc", [["abc", ""]]]);

type testTP = ["str", string] | ["num", number];

const a = $astaster<testTP>()({ num: (x) => x + x })
  .ast<["abc", number]>()
  .aster({ str: (x) => [x, x] as [typeof x, typeof x], abc: (x) => `abc_${x}` as const });

type TagParams = Astaster$TagParam<typeof a>;
type tSter = Astaster$Ster<typeof a>;

const x = a([
  "num",
  1,
  [
    ["num", 2],
    ["str", "str!"],
    ["abc", 1],
  ],
]);

const y = a([]);
