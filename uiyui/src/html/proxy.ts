import { a, k1, Split, ObjectFromStrings } from "jsyoyo";
import { __, ARR } from "~types";
import { Var } from "ioioy";

type HTMLTag = keyof HTMLElementTagNameMap;
type WriteableProps<K extends HTMLTag = HTMLTag> = WritableHTMLElementData<HTMLElementTagNameMap[K]>;

type Variant<K extends HTMLTag = HTMLTag> = string | ARR<string> | WriteableProps<K>;
type Variants<K extends HTMLTag = HTMLTag> = ARR<string> | Record<string, Variant<K>>;
type NormalizeVariants<Vs extends Variants> =
  Vs extends ARR<string>
    ? NormalizeVariants<ObjectFromStrings<Vs>>
    : {
        [K in keyof Vs]: Vs[K] extends string
          ? {
              classList: Split<Vs[K], " ">;
            }
          : Vs[K] extends string[]
            ? { classList: Vs[K] }
            : Vs[K];
      };

type DenoiseHTMLElementKeys<T> = {
  [K in keyof T]-?: K extends `${Uppercase<string>}${string}` | `on${string}` | `aria${string}` ? never : K;
}[keyof T];
type DenoiseHTMLElement<T> = Pick<T, DenoiseHTMLElementKeys<T>>;

type HTMLImprovedElement<K extends HTMLTag = HTMLTag> = DenoiseHTMLElement<HTMLElementTagNameMap[K]> & {
  $: { EL: HTMLElementTagNameMap[K] };
};

type HTMLPolyElement<
  T extends HTMLTag = HTMLTag,
  O = unknown,
  Vs extends Variants = Variants,
> = HTMLImprovedElement<T> & {
  $: {
    <K extends keyof Vs | undefined>(...[key]: [K] | []): K extends keyof Vs ? HTMLPolyElement<T, O, Vs> : keyof Vs;
    VAR: Var<{ IANTS: NormalizeVariants<Vs> }, keyof NormalizeVariants<Vs>>;
  };
};

type HTMLElements = {
  readonly [K in HTMLTag]: <const O extends WriteableProps<K>, const Vs extends Variants<K> | undefined = undefined>(
    opt?: O,
    variants?: Vs,
  ) => Vs extends Variants ? HTMLPolyElement<K, O, Vs> : HTMLImprovedElement<K>;
};

const applyProps = (el: HTMLImprovedElement, props: WriteableProps) => 1;

const switchVariant = <Vs extends Variants>(next: keyof Vs, el: HTMLPolyElement) => {
  const current = el.$.VAR.O.IANTS[el.$.VAR.X];

  applyProps(el, el.$.VAR.O.IANTS[next] as WriteableProps);
};

export const htmlProxy = new Proxy(
  {},
  {
    get: (_, p: HTMLTag) => (opt: any, vars: any) => {
      // oxlint-disable-next-line no-undef
      const $ = a(document.createElement(p), opt);
      opt.style && a($.style, opt.style);

      if (vars) {
        const v = Var(k1(vars), { IANTS: vars });
        $.$ = (...k: any[]) => (k.length ? (v.I(k[0]), $) : $.VAR.X);
        $.VAR = v;
        v.O((x) => {
          console.log("--->", x);
          switchVariant(x, $);
        });
      } else {
        $.$ = {};
      }

      $.$.EL = $;

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

type WritableHTMLElementData<E> = Partial<
  WritableDataProperties<E> & { style: Partial<CSSStyleDeclaration>; classList: readonly string[] }
>;
