import { ARR, dethunk, Fn$O } from "jsyoyo";
import { TagParam$MapByTag, AST1 } from "../types";

type FromMap<Tag, Map, AST> = Tag extends keyof Map ? Fn$O<Map[Tag]> : AST;

type ActFnArr<AST, Map, Default = never> = AST extends readonly [infer H, ...infer R]
  ? [ActFn<H, Map, Default>, ...ActFnArr<R, Map, Default>]
  : [];

type ActFn<AST, Map, Default = never> = AST extends readonly [infer Tag, any]
  ? FromMap<Tag, Map, AST>
  : AST extends readonly [infer Tag, any, infer R]
    ? [FromMap<Tag, Map, AST>, ActFnArr<R, Map, Default>]
    : AST extends (...k: any[]) => [infer Tag, any, any?]
      ? ActFn<[Tag, any], Map, Default>
      : Default;

export const ast1$act =
  <TagParam extends readonly [string, unknown]>() =>
  <
    Map extends Partial<TagParam$MapByTag<TagParam>>,
    ProxyMap extends Partial<TagParam$MapByTag<TagParam>>,
    // DefaultMap extends (
    //   params: TagParam$MapDefaultParams<TagParam, keyof NoInfer<Map> | keyof NoInfer<ProxyMap>>,
    // ) => unknown = (
    //   params: TagParam$MapDefaultParams<TagParam, keyof NoInfer<Map> | keyof NoInfer<ProxyMap>>,
    // ) => typeof params,
    Mapped =
      // | Fn$O<DefaultMap>
      | { [K in keyof NoInfer<ProxyMap>]: Fn$O<NoInfer<ProxyMap>[K]> }[keyof NoInfer<ProxyMap>]
      | { [K in keyof NoInfer<Map>]: Fn$O<NoInfer<Map>[K]> }[keyof NoInfer<Map>],
  >(
    map: Map,
    // proxyMap = {} as ProxyMap,
    //   defaultMap?: DefaultMap,
  ) =>
  <Acc = {}>(reduce?: (current: Mapped, kids: ARR<Mapped>, acc: NoInfer<Acc>) => void, acc = {} as Acc) =>
  <AST extends AST1<TagParam>>(ast: AST): [Acc, ActFn<AST, Map & ProxyMap /* Fn$O<DefaultMap> */>] => {
    // const [k, p, ks] = dethunk(ast);
    // const cs = 2;
    // const c = 1;
    dethunk({ map, reduce, acc });
    return dethunk(ast) as any;
  };
