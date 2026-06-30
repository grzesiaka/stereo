import { a } from "jsyoyo";
import { __, ARR } from "~types";

type HTMLTag = keyof HTMLElementTagNameMap;
type WriteableProps<K extends HTMLTag> = WritableHTMLElementData<HTMLElementTagNameMap[K]>;
type Variants<K extends HTMLTag> =
  | string
  | ARR<string>
  | Record<string, WritableDataProperties<K> & { klass?: string | ARR<string> }>;

type DenoiseHTMLElementKeys<T> = {
  [K in keyof T]-?: K extends `${Uppercase<string>}${string}` | `on${string}` | `aria${string}` ? never : K;
}[keyof T];
type DenoiseHTMLElement<T> = Pick<T, DenoiseHTMLElementKeys<T>>;

type HTMLElementPlus<K extends HTMLTag> = DenoiseHTMLElement<HTMLElementTagNameMap[K]> & {
  $EL: HTMLElementTagNameMap[K];
};

type HTMLElementWithVariants<K extends HTMLTag, Vs> = HTMLElementPlus<K> & { $$: Vs };

type HTMLElements = {
  readonly [K in HTMLTag]: <const O extends WriteableProps<K>, const Vs extends Variants<K> | undefined = undefined>(
    opt?: O,
    variants?: Vs,
  ) => __ extends Vs ? HTMLElementPlus<K> : HTMLElementWithVariants<K, Vs>;
};

export const htmlProxy = new Proxy(
  {},
  {
    get: (_, p: HTMLTag) => (opt: any, vs: any) => {
      // oxlint-disable-next-line no-undef
      const $ = a(document.createElement(p), opt);
      opt.style && a($.style, opt.style);
      $.$EL = $;

      if (vs) {
      }
      return $;
    },
  },
) as HTMLElements;

export default htmlProxy;

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

type WritableKeys<T> = {
  [K in keyof T]-?: IfEquals<{ [P in K]: T[P] }, { -readonly [P in K]: T[P] }, K>;
}[keyof T];

type SkipPrefix = "aria" | "innerHTML" | "outer";

type SkipKeys =
  | `${SkipPrefix}${string}`
  | "nodeValue"
  | "style" // must be partial
  | "classList"; /* readonly but not marked in TS as such */
type DataPropertiesKeys<T> = {
  // methods & callbacks
  [K in WritableKeys<T>]: T[K] extends ((...args: any[]) => any) | null | undefined
    ? never
    : K extends SkipKeys
      ? never
      : K;
}[WritableKeys<T>];

type WritableDataProperties<T> = Pick<T, DataPropertiesKeys<T>>;

type WritableHTMLElementData<E> = Partial<WritableDataProperties<E> & { style: Partial<CSSStyleDeclaration> }>;
