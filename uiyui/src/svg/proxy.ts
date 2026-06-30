import { a } from "jsyoyo";

type SVG = SVGElement;
const s: SVG = 1 as any;
s;

type SVGTag = keyof SVGElementTagNameMap;

type RemapOptions<T> = Partial<{
  [K in keyof T as K extends string
    ? K extends `aria${string}`
      ? never
      : K extends Capitalize<K>
        ? never
        : T[K] extends (...args: any[]) => any
          ? never
          : K
    : K]: T[K];
}> & {
  style?: Partial<CSSStyleDeclaration>;
};
type SVGElements = {
  readonly [K in SVGTag]: (opt: RemapOptions<SVGElementTagNameMap[K]>) => SVGElementTagNameMap[K];
};

export const svgProxy = new Proxy(
  {},
  {
    get: (_, p: SVGTag) => (opt: any) => {
      // oxlint-disable-next-line no-undef
      const $ = a(document.createElementNS("http://www.w3.org/2000/svg", p), opt);
      opt.style && a($.style, opt.style);
      return $;
    },
  },
) as SVGElements;

export default svgProxy;
