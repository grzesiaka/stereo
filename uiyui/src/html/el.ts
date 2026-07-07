import { ARR } from "jsyoyo";
import type __TYPES__ from "./__members__.gen";

type HTMLTag = keyof HTMLElementTagNameMap;
type TYPES = typeof __TYPES__;
type ELEMENTS = TYPES["elements"];

type BasePropsAll = TYPES["HTMLElement"]["data_writable"][number];

type AriaProps = Extract<BasePropsAll, `aria${string}`>;
type RemoveFromBaseProps =
  | "innerHTML"
  | "innerText"
  | "nodeValue"
  | "nonce"
  | "outerHTML"
  | "outerText"
  | "slot"
  | "spellcheck"
  | "style"
  | "translate"
  | "writingSuggestions";
type BaseProps = Exclude<BasePropsAll, AriaProps | RemoveFromBaseProps>;

type CustomProps<T extends HTMLTag> = ELEMENTS[T] extends {
  readonly data_writable: infer X extends ARR;
}
  ? X[number]
  : never;

type Props<T extends HTMLTag = HTMLTag> = Partial<BaseProps & CustomProps<T>>;

type HTMLElementPropsDeact = {
  readonly [K in HTMLTag]: <
    const O extends Props<K> | string = {},
    //   const Vs extends StatesRaw<K> | undefined = undefined,
  >(
    opt?: O,
    //   States?: Vs,
  ) => [K, [O extends string ? { id: O } : O]];
};

export const props = new Proxy(
  {},
  {
    get: (_, t: HTMLTag) => (o: string | Props) => [t, [typeof o === "string" ? { id: o } : o]],
  },
) as HTMLElementPropsDeact;

const a = props.a("abc");
