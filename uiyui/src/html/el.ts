import { a, ARR, fromStrings, ifArray, NoExtraKeys, k1, mb, ObjectFromStrings, Split, Fn$O } from "jsyoyo";
import type __TYPES__ from "./__members__.gen";
import { Simplify } from "type-fest";
import { actFn, AST1 } from "deacted";

// type $PropsFn<T extends HTMLTag> = ReturnType<typeof $propsFn<T>>;
const $propsFn =
  <T extends HTML_Tag>(_: T) =>
  <const P extends Props<T> | string = {}, const SR extends StatesRaw<T> | undefined = undefined>(
    P = {} as P extends string ? P : NoExtraKeys<P, Props<T>>,
    SR?: SR,
  ) => {
    const p = (typeof P === "string" ? { id: P } : P) as { id: string; $states: {} };
    SR && (p.$states = normalizeStates(SR));
    return p as never as NormalizeProps<T, P, SR>;
  };

const propsFn = actFn($propsFn) as PropsFn;

export type PropsProxy = { [T in HTML_Tag]: Fn$O<typeof propsFn<T>> };
export const props = new Proxy(propsFn, {
  get: (_, t: HTML_Tag) => propsFn(t),
}) as PropsFn & PropsProxy;

export const $el =
  <T extends HTML_Tag, const P extends Props<T, States<T>> = {}>(tag: T) =>
  (props?: NoExtraKeys<P, Props<T, States<T>>>) => {
    // oxlint-disable-next-line no-undef
    const e = document.createElement(tag) as HTMLElement;
    props && applyProps(e)(props);
    return e as never as HTMeLe<T, P>;
  };

export type HTMeLe<T extends HTML_Tag = HTML_Tag, P extends Props<T, States<T>> = Props<T, States<T>>> = P & {
  tagName: Uppercase<T>;
  // $<X extends keyof P = "id">(): HTMLElementTagNameMap[T] & { [K in X]: P[K] };
};
export type HTMeLe$Tag<E> = E extends { tagName: infer TAG extends Uppercase<HTML_Tag> } ? Lowercase<TAG> : never;
export type HTMeLe$Props<E> = E extends HTMeLe<any, infer P> ? P : never;

export const uy$html =
  <E extends HTMeLe>(e: E) =>
  <X extends keyof HTMeLe$Props<E> = "id">() =>
    e as never as HTMLElementTagNameMap[HTMeLe$Tag<E>] & { [K in X]: HTMeLe$Props<E>[K] };

const applyProps = (el: HTMLElement) => (props: Props) => {
  const { style, dataset, classList, ...rest } = props as Props & { tagName: any };
  a(el, rest);
  a(el.style, style);
  a(el.dataset, dataset);
  if (classList) {
    el.classList.add(...classList);
  }
  return el;
};

const getState = <Vs extends States>(vs: Vs, el: HTMLElement) =>
  (el.classList[0]! in vs ? el.classList[0] : k1(vs)) as keyof Vs & string;

export const $state =
  <E extends HTMeLe & { $states: States }>(e: E) =>
  (next: keyof E["$states"]) => {
    const el = e as never as HTMLElement;
    const currentKey = getState(e.$states, el);
    if (currentKey !== void 0) {
      const current = e.$states[currentKey];
      el.classList.remove(currentKey, ...((current as any).classList || []));
    }
    el.classList.add(next as string);
    applyProps(el)(e.$states[next as any] as Props);
  };

const normalizeStates = (vs: StatesRaw): NormalizeStates<StatesRaw> =>
  ifArray(
    vs,
    (vs) => normalizeStates(fromStrings(vs)),
    (vs) =>
      typeof vs === "string"
        ? normalizeStates(fromStrings(vs.split(" ")))
        : mb((v: StateRaw) =>
            ifArray(
              v,
              (v) => ({
                classList: v,
              }),
              (v) =>
                typeof v === "string"
                  ? {
                      classList: v.split(" "),
                    }
                  : v,
            ),
          )(vs),
  );

export type HTML_Tag = keyof HTMLElementTagNameMap;
type TYPES = typeof __TYPES__;
type ELEMENTS = TYPES["elements"];

type HTMLTagAndProps<T extends HTML_Tag = HTML_Tag> = readonly [T, Props<T, States<T>>];
export type HTML_AST<Extra extends readonly [string, unknown] = never> = AST1<HTMLTagAndProps | Extra>;

type PropsFn = <T extends HTML_Tag>(
  T: T,
) => <const P extends Props<T> | string = {}, const SR extends StatesRaw<T> | undefined = undefined>(
  P?: P,
  SR?: SR,
) => <Kids extends ARR>(
  ...kids: Kids
) => Kids extends readonly [] ? [T, NormalizeProps<T, P, SR>] : [T, NormalizeProps<T, P, SR>, Kids];

type NormalizeProps<T extends HTML_Tag, P extends Props<T> | string, SR extends StatesRaw<T> | undefined> = Simplify<
  P extends string ? { id: P } : P & (SR extends StatesRaw ? { $states: NormalizeStates<SR> } : {})
>;

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
  | "classList"
  | "translate"
  | "writingSuggestions";
type BaseProps = Exclude<BasePropsAll, AriaProps | RemoveFromBaseProps>;

type CustomProps<T extends HTML_Tag> = ELEMENTS[T] extends {
  readonly data_writable: infer X extends ARR;
}
  ? X[number]
  : never;

type PropsRequired<T extends HTML_Tag = HTML_Tag> = Pick<HTMLElementTagNameMap[T], BaseProps | CustomProps<T>> & {
  style: Partial<CSSStyleDeclaration>;
  classList: readonly string[];
  dataset: Record<string, string>;
};

type Props<T extends HTML_Tag = HTML_Tag, S extends States<T> = {}> = Partial<PropsRequired<T>> &
  (S extends {}
    ? {}
    : {
        $states: S;
      });

export type HTML_Props<T extends HTML_Tag = HTML_Tag, S extends States<T> = {}> = Props<T, S>;

type StateRaw<K extends HTML_Tag = HTML_Tag> = string | ARR<string> | Props<K>;
type StatesRaw<K extends HTML_Tag = HTML_Tag> = string | ARR<string> | Record<string, StateRaw<K>>;
type NormalizeStates<Vs extends StatesRaw = StatesRaw> = Vs extends string
  ? NormalizeStates<Split<Vs, " ">>
  : Vs extends ARR<string>
    ? NormalizeStates<ObjectFromStrings<Vs>>
    : {
        [K in keyof Vs]: Vs[K] extends string
          ? {
              classList: Split<Vs[K], " ">;
            }
          : Vs[K] extends string[]
            ? { classList: Vs[K] }
            : Vs[K];
      };
type States<T extends HTML_Tag = HTML_Tag> = Record<string, Props<T>>;

declare global {
  // interface HTMLElement {
  //   $(): HTMeLe<Lowercase<this["tagName"]> extends HTML_Tag ? Lowercase<this["tagName"]> : never, {}>;
  // }

  interface HTMLAnchorElement {
    tagName: "A";
  }
  interface HTMLAreaElement {
    tagName: "AREA";
  }
  interface HTMLAudioElement {
    tagName: "AUDIO";
  }
  interface HTMLBaseElement {
    tagName: "BASE";
  }
  interface HTMLQuoteElement {
    tagName: "Q" | "BLOCKQUOTE";
  }
  interface HTMLBodyElement {
    tagName: "BODY";
  }
  interface HTMLButtonElement {
    tagName: "BUTTON";
  }
  interface HTMLCanvasElement {
    tagName: "CANVAS";
  }
  interface HTMLTableColElement {
    tagName: "COL" | "COLGROUP";
  }
  interface HTMLTableColElement {
    tagName: "COL" | "COLGROUP";
  }
  interface HTMLDataElement {
    tagName: "DATA";
  }
  interface HTMLDataListElement {
    tagName: "DATALIST";
  }
  interface HTMLModElement {
    tagName: "DEL" | "INS";
  }
  interface HTMLDetailsElement {
    tagName: "DETAILS";
  }
  interface HTMLDialogElement {
    tagName: "DIALOG";
  }
  interface HTMLEmbedElement {
    tagName: "EMBED";
  }
  interface HTMLFieldSetElement {
    tagName: "FIELDSET";
  }
  interface HTMLFormElement {
    tagName: "FORM";
  }
  interface HTMLIFrameElement {
    tagName: "IFRAME";
  }
  interface HTMLImageElement {
    tagName: "IMG";
  }
  interface HTMLInputElement {
    tagName: "INPUT";
  }
  interface HTMLModElement {
    tagName: "DEL" | "INS";
  }
  interface HTMLLabelElement {
    tagName: "LABEL";
  }
  interface HTMLLegendElement {
    tagName: "LEGEND";
  }
  interface HTMLLIElement {
    tagName: "LI";
  }
  interface HTMLLinkElement {
    tagName: "LINK";
  }
  interface HTMLMapElement {
    tagName: "MAP";
  }
  interface HTMLMetaElement {
    tagName: "META";
  }
  interface HTMLMeterElement {
    tagName: "METER";
  }
  interface HTMLObjectElement {
    tagName: "OBJECT";
  }
  interface HTMLOListElement {
    tagName: "OL";
  }
  interface HTMLOptGroupElement {
    tagName: "OPTGROUP";
  }
  interface HTMLOptionElement {
    tagName: "OPTION";
  }
  interface HTMLOutputElement {
    tagName: "OUTPUT";
  }
  interface HTMLProgressElement {
    tagName: "PROGRESS";
  }
  interface HTMLQuoteElement {
    tagName: "Q" | "BLOCKQUOTE";
  }
  interface HTMLScriptElement {
    tagName: "SCRIPT";
  }
  interface HTMLSelectElement {
    tagName: "SELECT";
  }
  interface HTMLSlotElement {
    tagName: "SLOT";
  }
  interface HTMLSourceElement {
    tagName: "SOURCE";
  }
  interface HTMLStyleElement {
    tagName: "STYLE";
  }
  interface HTMLTableElement {
    tagName: "TABLE";
  }
  interface HTMLTableSectionElement {
    tagName: "TBODY" | "TFOOT" | "THEAD";
  }
  interface HTMLTableCellElement {
    tagName: "TD" | "TH";
  }
  interface HTMLTemplateElement {
    tagName: "TEMPLATE";
  }
  interface HTMLTextAreaElement {
    tagName: "TEXTAREA";
  }
  interface HTMLTableSectionElement {
    tagName: "TBODY" | "TFOOT" | "THEAD";
  }
  interface HTMLTableCellElement {
    tagName: "TD" | "TH";
  }
  interface HTMLTableSectionElement {
    tagName: "TBODY" | "TFOOT" | "THEAD";
  }
  interface HTMLTimeElement {
    tagName: "TIME";
  }
  interface HTMLTitleElement {
    tagName: "TITLE";
  }
  interface HTMLTableRowElement {
    tagName: "TR";
  }
  interface HTMLTrackElement {
    tagName: "TRACK";
  }
  interface HTMLVideoElement {
    tagName: "VIDEO";
  }
}

// oxlint-disable-next-line no-undef
// HTMLElement.prototype.$ = function () {
//   return this as any;
// };
