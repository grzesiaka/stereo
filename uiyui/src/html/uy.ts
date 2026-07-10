import { dethunk, NestedArrays$ValuesUnion } from "jsyoyo";
import { $el, HTML_AST, HTML_Tag, HTML_Props, uyElement } from "./el";

type InitHTMLs<Kids> = Kids extends readonly [infer H, ...infer R] ? [InitHTML<H>, ...InitHTMLs<R>] : [];

export type InitHTML<AST> = AST extends (...a: any[]) => readonly [infer T, infer P extends HTML_Props<any>, any?]
  ? InitHTML<[T, P]>
  : AST extends [infer T extends HTML_Tag, infer P extends HTML_Props<any>, infer Kids]
    ? [uyElement<T, P>, InitHTMLs<Kids>]
    : AST extends [infer T extends HTML_Tag, infer P extends HTML_Props<any>]
      ? uyElement<T, P>
      : never;

export type BY_ID<T> = {
  [Node in NestedArrays$ValuesUnion<T, { id: string }> as Node extends { id: infer Id extends string }
    ? Id
    : never]: Node;
};

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
  (e as never as HTMLElement).append(...(ch as never as HTMLElement[]));
  return [e, ch] as InitHTML<AST>;
};

export const init = <AST extends HTML_AST>(ast: AST) => {
  const ids = {};
  const dom = _init(ast, ids);
  return { dom, ids } as { dom: typeof dom; ids: BY_ID<typeof dom> };
};
