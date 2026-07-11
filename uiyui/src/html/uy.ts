import { dethunk, NestedArrays$ValuesUnion, Union$ObjectById } from "jsyoyo";
import { $el, HTML_AST, HTML_Tag, HTML_Props, HTMeLe } from "./el";

type InitHTMLs<Kids> = Kids extends readonly [infer H, ...infer R] ? [InitHTML<H>, ...InitHTMLs<R>] : [];

export type InitHTML<AST> = AST extends (...a: any[]) => readonly [infer T, infer P extends HTML_Props<any>, any?]
  ? InitHTML<[T, P]>
  : AST extends [infer T extends HTML_Tag, infer P extends HTML_Props<any>, infer Kids]
    ? [HTMeLe<T, P>, InitHTMLs<Kids>]
    : AST extends [infer T extends HTML_Tag, infer P extends HTML_Props<any>]
      ? HTMeLe<T, P>
      : never;

export type BY_ID<T> = Union$ObjectById<NestedArrays$ValuesUnion<T, { id: string }>, "id">;

// type Prettify<T> = {
//   [K in keyof T]: T[K];
// } & {};

// // The recursive generic
// type ReduceAST<T> = T extends readonly[infer Tag extends string, infer Params, ...infer Rest]
//   ? { [K in Tag]: Params } &
//       // Check if there is a 3rd element, and recursively process it
//       (Rest extends [infer Child, ...any[]] ? ReduceAST<Child> : {})
//   : {};

// // Your final exported type
// export type FlatAST<T> = Prettify<ReduceAST<T>>;

// type ASTEntriesArr<T> = T extends readonly [infer H, ...infer R] ? ASTEntries<H> | ASTEntriesArr<R> : never;

// type ASTEntries<T> = T extends readonly [infer Tag extends string, infer Params]
//   ? { tag: Tag; params: Params }
//   : T extends readonly [infer Tag extends string, infer Params, infer Rest]
//     ? { tag: Tag; params: Params } | ASTEntriesArr<Rest>
//     : never;

// export type FlatAST<T> = {
//   [Entry in ASTEntries<T> as Entry["tag"]]: Entry["params"];
// };

type _FlatAST<T> = T extends (...ps: any[]) => readonly [infer T, infer P, unknown?]
  ? [T, P]
  : T extends readonly [infer T extends string, infer P]
    ? [T, P]
    : T extends readonly [infer T extends string, infer P, infer R]
      ? [T, P] | _FlatAST<R>
      : T extends readonly (infer E)[]
        ? _FlatAST<E>
        : never;
export type FlatAST<T> = { [K in _FlatAST<T>[0] & string]: Extract<_FlatAST<T>, [K, any]> };

const _init = <AST extends HTML_AST>(ast: AST, ids = {} as Partial<BY_ID<InitHTML<AST>>>): InitHTML<AST> => {
  const [t, p, ks] = dethunk(ast);
  if (!ks || !ks.length) {
    const e = $el(t)(p) as InitHTML<AST>;
    // @ts-expect-error
    e.id && (ids[e.id] = e);
    return e;
  }
  const e = $el(t)(p);
  // @ts-expect-error
  e.id && (ids[e.id] = e);
  const ch = ks.map((k) => _init(k as AST, ids));

  (e as never as HTMLElement).append(
    // array is actually a tuple [el, kids[]] so only parent is mounted to grandparent
    ...(ch as never as HTMLElement[][]).flatMap((c) => (Array.isArray(c) ? c[0]! : c)),
  );
  return [e, ch] as InitHTML<AST>;
};

export const init = <AST extends HTML_AST>(ast: AST) => {
  const ids = {};
  const dom = _init(ast, ids);
  return { dom, ids } as { dom: typeof dom; ids: BY_ID<typeof dom> };
};
