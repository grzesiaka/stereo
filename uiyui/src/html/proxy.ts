import { a, k1, Split, ObjectFromStrings, ifArray, fromStrings, mb, Fn, WritableKeys } from "jsyoyo";
import { __, ARR } from "~types";

type HTMLTag = keyof HTMLElementTagNameMap;
// TOOD this is kind of backwards - just generate slimmer api surface area based on @types/web/index.d.ts
type WriteableProps<K extends HTMLTag = HTMLTag> = WritableHTMLElementData<HTMLElementTagNameMap[K]>;

type State<K extends HTMLTag = HTMLTag> = string | ARR<string> | WriteableProps<K>;
type StatesRaw<K extends HTMLTag = HTMLTag> = string | ARR<string> | Record<string, State<K>>;
type NormalizeStates<Vs extends StatesRaw> = Vs extends string
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
type States<Vs extends StatesRaw = StatesRaw> = NormalizeStates<Vs>;

type EventsNames<El> = { [K in keyof El]: K extends `on${infer Ev}` ? Ev : never }[keyof El];
type EventsHandlersAll<El> = {
  [K in EventsNames<El>]: El[`on${K}` & keyof El] extends Fn | null
    ? (this: El, ev: Parameters<NonNullable<El[`on${K}` & keyof El]>>[0]) => void
    : never;
};
type EventsHandlers<El> = Partial<EventsHandlersAll<El>>;

export type HTMLImprovedElement<
  K extends HTMLTag = HTMLTag,
  O extends WriteableProps<K> | string = {},
> = HTMLElementTagNameMap[K] & {
  $(p: WriteableProps<K>): HTMLImprovedElement<K, O>;
} & (O extends string ? { id: O } : O) & { $: { on: (hs: EventsHandlers<HTMLImprovedElement<K, O>>) => () => void } };

export type HTMLPolyElement<
  T extends HTMLTag = HTMLTag,
  O extends WriteableProps<T> | string = {},
  Vs extends StatesRaw = StatesRaw,
> = HTMLElementTagNameMap[T] & {
  $(p: WriteableProps<T>): HTMLPolyElement<T, O, Vs>;
} & (O extends string ? { id: O } : O) & {
    $: { on: (hs: EventsHandlers<HTMLPolyElement<T, O, Vs>>) => () => void };
  } & {
    $: {
      <K extends keyof States<Vs> | undefined>(
        ...[key]: [K] | []
      ): K extends keyof Vs ? HTMLPolyElement<T, O, Vs> : keyof Vs;
    };
  };

type HTMLElements = {
  readonly [K in HTMLTag]: <
    const O extends WriteableProps<K> | string = {},
    const Vs extends StatesRaw<K> | undefined = undefined,
  >(
    opt?: O,
    States?: Vs,
  ) => Vs extends StatesRaw<K> ? HTMLPolyElement<K, O, Vs> : HTMLImprovedElement<K, O>;
};

const applyProps = (el: HTMLElement) => (props: WriteableProps) => {
  const { style, dataset, classList, ...rest } = props;
  a(el, rest);
  a(el.style, style);
  a(el.dataset, dataset);
  if (classList) {
    el.classList.add(...classList);
  }
  return el;
};

const getState = <Vs extends States>(vs: Vs, el: HTMLPolyElement) =>
  (el.classList[0]! in vs ? el.classList[0] : k1(vs)) as keyof Vs & string;

const switchState = <Vs extends States>(next: keyof Vs, vs: Vs, el: HTMLPolyElement) => {
  const currentKey = getState(vs, el);
  if (currentKey !== void 0) {
    const current = vs[currentKey];
    el.classList.remove(currentKey, ...((current as any).classList || []));
  }
  el.classList.add(next as string);
  applyProps(el)(vs[next] as WriteableProps);
};

const normalizeStates = (vs: StatesRaw): States<StatesRaw> =>
  ifArray(
    vs,
    (vs) => normalizeStates(fromStrings(vs)),
    (vs) =>
      typeof vs === "string"
        ? normalizeStates(fromStrings(vs.split(" ")))
        : mb((v: State) =>
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

export const htmlProxy = new Proxy(
  {},
  {
    get: (_, p: HTMLTag) => (opt: any, vars: any) => {
      // oxlint-disable-next-line no-undef
      const $ = document.createElement(p) as HTMLPolyElement;

      if (!vars) {
        // @ts-expect-error
        $.$ = applyProps($);
      }

      if (vars) {
        const vs = normalizeStates(vars);
        // @ts-expect-error
        $.$ = (k?: any) =>
          k === void 0 ? [getState(vs, $), vs] : (typeof k === "string" ? switchState(k, vs, $) : applyProps($)(k), $);
        switchState(k1(vs), vs, $);
      }

      opt && $.$(typeof opt === "string" ? { id: opt } : opt);

      $.$.on = (hs) => {
        mb((cb, k) => $.addEventListener(k, cb))(hs);
        return () => mb((cb, k) => $.removeEventListener(k, cb))(hs);
      };
      return $;
    },
  },
) as HTMLElements;

export default htmlProxy;

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
  WritableDataProperties<E> & {
    style: Partial<CSSStyleDeclaration>;
    classList: readonly string[];
    dataset: Record<string, string>;
  }
>;

// type DenoiseHTMLElementKeys<T> = {
//   [K in keyof T]-?: K extends `${Uppercase<string>}${string}` | `on${string}` | `aria${string}` ? never : K;
// }[keyof T];
// type DenoiseHTMLElement<T> = Pick<T, DenoiseHTMLElementKeys<T>>;
