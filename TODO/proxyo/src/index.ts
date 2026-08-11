import { ARR } from "~types";
import { Tree, Tree$KeyValuePairs } from "treeo";

// proxyo - helpers for creating and working with JS proxies

// TODO: Is it even needed (?)

export type ProxyoSpec = Tree<ARR>;

type DeepMapArrays$Unknown<T> = T extends readonly unknown[]
  ? unknown
  : { [K in keyof T]: DeepMapArrays$Unknown<T[K]> };

export type ProxyoSpec$Events<S extends ProxyoSpec> = Tree$KeyValuePairs<S, DeepMapArrays$Unknown<S>>;

// type Events = ProxyoSpec$Events<{ a: { aa: [0, 1]; bb: ["b01"] } }>;

// export type ProxyoHandler<S extends ProxyoSpec> = 1;

export const $proxyo = () => 1;

type CallableSelection<T, Path extends readonly PropertyKey[] = []> = T extends (...args: infer Args) => unknown
  ? [path: Path, args: Args]
  : T extends object
    ? {
        [K in keyof T]-?: CallableSelection<T[K], [...Path, K]>;
      }[keyof T]
    : never;

type Reporter<T> = (...selection: CallableSelection<T>) => void;

type PathProxy<T> = T extends (...args: infer Args) => infer Result
  ? (...args: Args) => Result
  : T extends object
    ? { [K in keyof T]: PathProxy<T[K]> }
    : never;

function createPathProxy<T>(report: Reporter<T>): PathProxy<T> {
  const create = (path: readonly PropertyKey[]): unknown => {
    const target = () => undefined;

    return new Proxy(target, {
      get(_target, key) {
        return create([...path, key]);
      },

      apply(_target, _thisArg, args) {
        // Runtime construction loses the static path/argument correlation.
        // The unsafe boundary stays internal.
        report(...([path, args] as unknown as CallableSelection<T>));
      },
    });
  };

  return create([]) as PathProxy<T>;
}

type API =
  | { abc: "cde" }
  | {
      user: {
        update(name: string, age: number): boolean;
        remove(id: number): void;
      };

      settings: {
        reset(hard?: boolean): void;
      };
    };

const api = createPathProxy<API>(() => {
  // selection:
  // | [path: ["user", "update"], args: [name: string, age: number]]
  // | [path: ["user", "remove"], args: [id: number]]
  // | [path: ["settings", "reset"], args: [hard?: boolean]]
});

if ("user" in api) {
  api.user.update("user", 42);
  api.user.remove(123);
  api.settings.reset(true);
}
