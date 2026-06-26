import { a } from "jsyoyo";

type HTMLTag = keyof HTMLElementTagNameMap;
type RemapOptions<E> = Omit<Partial<E>, "style"> & { style?: Partial<CSSStyleDeclaration> };
type HTMLElements = {
  readonly [K in HTMLTag]: (opt: RemapOptions<HTMLElementTagNameMap[K]>) => HTMLElementTagNameMap[K];
};

export const html = new Proxy(
  {},
  {
    get: (_, p: HTMLTag) => (opt: any) => {
      // oxlint-disable-next-line no-undef
      const $ = a(document.createElement(p), opt);
      opt.style && a($.style, opt.style);
      return $;
    },
  },
) as HTMLElements;

export default html;
