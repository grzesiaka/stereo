import type * as TF from "type-fest";
import { ARR, Fn, Fn$I, Fn0 } from "~js";

export type Tree<X = unknown> = X | { [k in string]: Tree<X> };

export type Tree_of_Functions<Input extends ARR = ARR, Output = unknown> = Tree<Fn<Input, Output>>;
export type Tree_of_Thunks<Output = unknown> = Tree<Fn0<Output>>;

export type Tree_of_Functions$Tree_of_Outputs<T> = T extends { readonly [K in string]: any }
  ? { [K in keyof T]: Tree_of_Functions$Tree_of_Outputs<T[K]> }
  : T extends Fn
    ? ReturnType<T>
    : never;

type Tree$ValueKeyPairs<T> = { [K in TF.Paths<T, { leavesOnly: true }> & string]: [TF.Get<T, K>, K] }[TF.Paths<
  T,
  { leavesOnly: true }
> &
  string];

type MapTree<T, X> = T extends Fn
  ? X
  : T extends ARR
    ? X
    : T extends { readonly [K in string]: any }
      ? { [K in keyof T]: MapTree<T[K], X> }
      : X;
export const mapTree =
  <T extends Tree>(t: T, ks = "") =>
  <X>(f: (vk: Tree$ValueKeyPairs<T>) => X): MapTree<T, X> => {
    if (typeof t === "object" && !Array.isArray(t) && t !== null) {
      return Object.entries(t).reduce((a, [k, v]) => {
        a[k] = mapTree(v, ks ? `${ks}.${k}` : k)(f);
        return a;
      }, {} as any);
    } else {
      return f([t as any, ks as any]) as any;
    }
  };

export const reduceTree =
  <T extends Tree>(t: T) =>
  <X>(x: X, f: (x: X, vk: Tree$ValueKeyPairs<T>) => void) => {
    mapTree(t)((vk) => f(x, vk));
    return x;
  };

export const tree2vks = <T extends Tree>(t: T): Tree$ValueKeyPairs<T>[] =>
  reduceTree(t)([] as Tree$ValueKeyPairs<T>[], (x, vk) => x.push(vk));

export const load =
  <F extends Fn>(f: F) =>
  <I extends Fn$I<F>>(...I: I) => {
    const r = () => r._F(...r._L);
    r._F = f;
    r._L = I;
    return r;
  };

type OBJECT_PATH = TF.Tagged<string, "OBJECT_PATH", ".">;

type L2R<T, L extends ARR = ARR> =
  T extends Fn<[...L, OBJECT_PATH]>
    ? Fn0<ReturnType<T>> & { _L: L }
    : T extends { readonly [K in string]: any }
      ? { [K in keyof T]: L2R<T[K], L> }
      : never;
export const L =
  <const L extends ARR>(...L: L) =>
  <const T extends Tree_of_Functions<[...L, OBJECT_PATH]>>(t: T) =>
    mapTree(t)(([f, _]: [any, any]) => load(f)(...L, _)) as any as L2R<T, L>;
L._ =
  <L extends ARR>() =>
  <const T extends Tree_of_Functions<[...L, OBJECT_PATH]>>(t: T) =>
  (_L: L) =>
    L(..._L)(t);

export const eXe = <T extends Tree_of_Thunks>(t: T) =>
  mapTree(t)(([$, _]) => ($ as any)()) as Tree_of_Functions$Tree_of_Outputs<T>;

type CMDIFY1<F extends Fn, Id extends string> = <Params extends Fn$I<F>>(
  ...params: Params
) => <Content extends ARR>(...content: Content) => [Id, Params, Content];
export const cmdify1 =
  <F extends Fn, Id extends string>(_: F, id: Id): CMDIFY1<F, Id> =>
  (...params) =>
  (...content) => [id, params, content];

type CMDIFY<T, P extends string = ""> = T extends Fn
  ? CMDIFY1<T, P>
  : T extends { readonly [K in string]: any }
    ? { [k in keyof T & string]: CMDIFY<T[k], `${P}.${k}`> }
    : never;
export const cmdify = <T extends Tree_of_Functions>(t: T) =>
  mapTree(t)((vk) => cmdify1(vk[0] as any, vk[1])) as any as CMDIFY<T>;

export const cmdifyNoContent = () => 1;
export const mergeTrees = () => 1;
export const eXeAsync = () => 1;
