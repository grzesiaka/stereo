import { ARR, Dict, Fn, Fn$I } from "~types";
import { __ } from "composyo";

type __ALL__ = /*"__ALL__" |*/ "⨂";
type __SOME__ = /*"__SOME__" |*/ "⨁";

type HierarchyNodeType = __ALL__ | __SOME__;

type HierarchyLeaf<
  OP extends string = string,
  Params = unknown,
  Alias extends string | undefined = string | undefined,
> = Alias extends undefined ? readonly [OP, Params] : readonly [OP, Params, Alias];

type HierarchyNode<
  ID extends string = string,
  Leaves extends HierarchyLeaf = HierarchyLeaf,
  Internal extends ARR<HierarchyNode | Leaves> = ARR<HierarchyNode<string, Leaves, any> | Leaves>,
> = readonly [HierarchyNodeType, ID, Internal];

type Hierarchy<Leaves extends HierarchyLeaf = HierarchyLeaf> = HierarchyNode<string, Leaves>;

export type DeactOps<OPs extends Dict<Fn>> = {
  [OP in keyof OPs]: {
    <Params extends Fn$I<OPs[OP]>>(...p: Params): [OP, Params];
  } & {
    [OP in `${keyof OPs & string}$`]: {
      <Alias extends string, Params extends Fn$I<OPs[OP]>>(a: Alias, ...p: Params): [OP, Params, Alias];
    };
  };
};

export type Leafify<OPs extends Dict<Fn, string>> = {
  [OP in keyof OPs]: HierarchyLeaf<OP & string, Fn$I<OPs[OP]>>;
}[keyof OPs];

const deactOps = <OPs extends Dict<Fn>>(_?: OPs) =>
  new Proxy(
    {},
    { get: (_, k: string) => (k.endsWith("$") ? (a: string, ...ps: any) => [k, ps, a] : (...ps: any) => [k, ps]) },
  ) as DeactOps<OPs>;

export const hierarchy =
  <OPs extends Dict<Fn> = {}>(ops?: OPs) =>
  <const H extends Hierarchy<Leafify<OPs>>>($: (ops: DeactOps<OPs>) => H) =>
    $(deactOps(ops));
