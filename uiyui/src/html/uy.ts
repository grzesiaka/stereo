import { dethunk } from "jsyoyo";
import { $el, HTML_AST, HTML_Tag, HTML_Props, UYElement } from "./el";

// type HTML = HTML_Props | readonly [HTML_Props, ARR<HTML>?];

type InitHTMLs<Kids> = Kids extends readonly [infer H, ...infer R] ? [InitHTML<H>, ...InitHTMLs<R>] : [];

type InitHTML<AST> = AST extends (...a: any[]) => readonly [infer T, infer P extends HTML_Props<any>, any?]
  ? InitHTML<[T, P]>
  : AST extends [infer T extends HTML_Tag, infer P extends HTML_Props<any>, infer Kids]
    ? [UYElement<T, P>, InitHTMLs<Kids>]
    : AST extends [infer T extends HTML_Tag, infer P extends HTML_Props<any>]
      ? UYElement<T, P>
      : never;

type BY_ID_ARR<Arr> = Arr extends readonly [infer H, ...infer R] ? BY_ID<H> & BY_ID_ARR<R> : {};
type BY_ID1<E> = E extends { id: infer Id extends string } ? { [id in Id]: E } : {};
type BY_ID<HTML> = HTML extends readonly [infer E, infer R] ? BY_ID1<E> & BY_ID_ARR<R> : BY_ID1<HTML>;

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
  const ch = ks.map((k) => _init(k, ids));
  (e as never as HTMLElement).append(...(ch as never as HTMLElement[]));
  return [e, ch] as InitHTML<AST>;
};

export const init = <AST extends HTML_AST>(ast: AST) => {
  const ids = {};
  const dom = _init(ast, ids);
  return { dom, ids } as { dom: typeof dom; ids: BY_ID<typeof dom> };
};
