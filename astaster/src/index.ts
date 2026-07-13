import { ARR, Fn$O } from "~types";

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
      : never;

export interface Astaster<TPs extends TagParam, M extends TagParam$Ster<TPs>> {
  <const ASt extends AST<TPs>>(ast: ASt): MapAST<ASt, M>;
  ast: <nTPs extends TagParam>() => Astaster<TPs | nTPs, M>;
  aster: <N extends TagParam$Ster<TPs>>(N: N) => Astaster<TPs, M & N>;
  ster: M;
}
export const $astaster =
  <TPs extends TagParam>() =>
  <M extends TagParam$Ster<TPs>>(ster: M): Astaster<TPs, M> => {
    const a: Astaster<TPs, M> = (ast) => {
      return 1 as any;
    };
    a.ast = () => a;
    a.ster = ster;
    a.aster = (ster) => ({ ...a.ster, ...ster }) as any;
    return a;
  };

type testTP = ["str", string] | ["num", number];

const a = $astaster<testTP>()({ num: (x) => x + x });

const x = a([
  "num",
  1,
  [
    ["num", 2],
    ["str", "str!"],
    ["abc", 1],
  ],
]);

//const y = x[0];

const testHandler = {
  num: (x) => x,
  //   str: (x) => x,
  //   num: (x) => x,
} satisfies TagParam$Ster<testTP>;
