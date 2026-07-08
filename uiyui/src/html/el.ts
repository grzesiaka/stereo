import { ARR, Fn$O, fromStrings, ifArray, mb, ObjectFromStrings, Split } from "jsyoyo";
import type __TYPES__ from "./__members__.gen";

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

// export const init = new Proxy({}, {
//     get: () =>
// })

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

type Props<T extends HTMLTag = HTMLTag> = Partial<BaseProps & CustomProps<T>>;

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
type States<Vs extends StatesRaw> = Vs extends string
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
    $$$(): States;
  }
}

// oxlint-disable-next-line no-undef
HTMLElement.prototype.$$$ = function () {
  return this.$states;
};
