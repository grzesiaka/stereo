import { a, ARR, Fn$O, fromStrings, ifArray, k1, mb, ObjectFromStrings, Split } from "jsyoyo";
import type __TYPES__ from "./__members__.gen";

export const $el = <T extends HTMLTag, P extends Props<T>>(tag: T, props: P) => {
  // oxlint-disable-next-line no-undef
  const e = document.createElement(tag);
  applyProps(e)(props);
  return e as never as UYElement<T, P>;
};

export type UYElement<T extends HTMLTag, P extends Props<T>> = P & { tagName: `${Uppercase<T>}` };

export const props = new Proxy(
  {},
  {
    get: (_, t: HTMLTag) => (o: string | Props, s?: StatesRaw) => {
      return [
        t, // TODO it might be prefix / suffix if needed to fully reflect domain
        [typeof o === "string" ? { id: o } : o].concat(s ? [normalizeStates(s)] : ([] as any)),
      ];
    },
  },
) as HTMLElementProps;

type AST = Fn$O<HTMLElementProps[keyof HTMLElementProps]>;

const applyProps = (el: HTMLElement) => (props: Props) => {
  const { style, dataset, classList, ...rest } = props;
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

const switchState = <Vs extends States>(next: keyof Vs, vs: Vs, el: HTMLElement) => {
  const currentKey = getState(vs, el);
  if (currentKey !== void 0) {
    const current = vs[currentKey];
    el.classList.remove(currentKey, ...((current as any).classList || []));
  }
  el.classList.add(next as string);
  applyProps(el)(vs[next] as Props);
};

const normalizeStates = (vs: StatesRaw): States<StatesRaw> =>
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

type PropsRequired<T extends HTMLTag = HTMLTag> = Pick<HTMLElementTagNameMap[T], BaseProps | CustomProps<T>> & {
  style: Partial<CSSStyleDeclaration>;
  classList: readonly string[];
  dataset: Record<string, string>;
};

type Props<T extends HTMLTag = HTMLTag> = Partial<PropsRequired<T>>;

type HTMLElementProps = {
  readonly [K in HTMLTag]: <
    const O extends Props<K> | string = {},
    const Vs extends StatesRaw<K> | undefined = undefined,
  >(
    opt?: O,
    states?: Vs,
  ) => [K, [O extends string ? { id: O } : O, ...(Vs extends StatesRaw ? [States<Vs>] : [])]];
};

type StateRaw<K extends HTMLTag = HTMLTag> = string | ARR<string> | Props<K>;
type StatesRaw<K extends HTMLTag = HTMLTag> = string | ARR<string> | Record<string, StateRaw<K>>;
type States<Vs extends StatesRaw = StatesRaw> = Vs extends string
  ? States<Split<Vs, " ">>
  : Vs extends ARR<string>
    ? States<ObjectFromStrings<Vs>>
    : {
        [K in keyof Vs]: Vs[K] extends string
          ? {
              classList: Split<Vs[K], " ">;
            }
          : Vs[K] extends string[]
            ? { classList: Vs[K] }
            : Vs[K];
      };

declare global {
  interface HTMLElement<States = {}> {
    $states: States;
    $$(): this["tagName"];
  }

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
HTMLElement.prototype.$$ = function () {
  return this.tagName;
};
