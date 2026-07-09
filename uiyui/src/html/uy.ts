import { dethunk } from "jsyoyo";
import { $el, HTML_AST, HTML_Tag, HTML_Props, UYElement } from "./el";

type InitHTMLs<Kids> = Kids extends readonly [infer H, ...infer R] ? [InitHTML<H>, ...InitHTMLs<R>] : [];

type InitHTML<AST> = AST extends (...a: any[]) => readonly [infer T, infer P extends HTML_Props<any>, any?]
  ? InitHTML<[T, P]>
  : AST extends [infer T extends HTML_Tag, infer P extends HTML_Props<any>, infer Kids]
    ? [UYElement<T, P>, InitHTMLs<Kids>]
    : AST extends [infer T extends HTML_Tag, infer P extends HTML_Props<any>]
      ? UYElement<T, P>
      : never;
export const init = <AST extends HTML_AST>(ast: AST): InitHTML<AST> => {
  const [t, p, ks] = dethunk(ast);
  if (!ks || !ks.length) return $el(t)(p) as InitHTML<AST>;
  const e = $el(t)(p);
  const ch = ks.map(init);
  (e as never as HTMLElement).append(...(ch as never as HTMLElement[]));
  return [e, ch] as InitHTML<AST>;
};
