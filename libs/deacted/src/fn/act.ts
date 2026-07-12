import { ARR, dethunk, Fn$O } from "jsyoyo";
import { AST$MapByTag, AST$MapDefaultParams, AST$TagParamPairs, AST1 } from "../types";

type FromMap<Tag, Map, AST> = Tag extends keyof Map ? Fn$O<Map[Tag]> : AST;

type ActFnArr<AST, Map extends Partial<AST$MapByTag<cAST>>> = AST extends readonly [infer H, ...infer R]
  ? [ActFn<H, Map>, ...ActFnArr<R, Map>]
  : [];

type ActFn<AST, Map extends Partial<AST$MapByTag<cAST>>> = AST extends readonly [infer Tag, any]
  ? FromMap<Tag, Map, AST>
  : AST extends readonly [infer Tag, any, infer R]
    ? [FromMap<Tag, Map, AST>, ActFnArr<R, Map>]
    : AST extends (...k: any[]) => [infer Tag, any, any?]
      ? ActFn<[Tag, any], Map>
      : AST;

export const ast1$act =
  <cAST>() =>
  <
    Map extends Partial<AST$MapByTag<cAST>>,
    // ProxyMap extends Partial<AST$MapByTag<cAST>> = {},
    DefaultMap extends (params: AST$MapDefaultParams<cAST, keyof NoInfer<Map>>) => unknown = (
      params: AST$MapDefaultParams<cAST, keyof NoInfer<Map>>,
    ) => typeof params,
    Mapped = Fn$O<DefaultMap> | { [K in keyof NoInfer<Map>]: Fn$O<NoInfer<Map>[K]> }[keyof NoInfer<Map>],
  >(
    map: Map,
    //proxyMap = {} as ProxyMap,
    defaultMap?: DefaultMap,
  ) =>
  <Acc = {}>(reduce?: (current: Mapped, kids: ARR<Mapped>, acc: NoInfer<Acc>) => void, acc = {} as Acc) =>
  <AST extends cAST>(ast: AST): [Acc, ActFn<AST, Map>] => {
    // const [k, p, ks] = dethunk(ast);
    // const cs = 2;
    // const c = 1;
    dethunk({ map, reduce, acc });
    return dethunk(ast) as any;
  };

type cAST = AST1<["a.aa", "A3"] | ["html.div", "<div />"]>;
const ast = ["a.aa", "A3", [["html.div", "<div />"], () => ["a.aa", "A3"]]] as const satisfies cAST;

// type P = AST$MapDefaultParams<typeof ast, "a.aa">;

const t = ast1$act<cAST>()({ "a.aa": (x) => ({ x: `xxx${x}xxx` as const }) }, (x) => x[1])(
  (current, kids, acc) => 1,
  {} as { abc: 1 },
)(ast);
// @ts-ignore
type tAST = AST$TagParamPairs<typeof t>;
// @ts-ignore
const tt = ast1$act<typeof t>()({ "html.div": (x) => `<div>${x}</div>` as const })(t);
