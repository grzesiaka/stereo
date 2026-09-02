import { Tree } from "./types";

type Set<T, Path extends string, Value> = Path extends `${infer K}.${infer Rest}`
  ? {
      [P in keyof T | K]: P extends K
        ? Set<P extends keyof T ? (T[P] extends object ? T[P] : {}) : {}, Rest, Value>
        : P extends keyof T
          ? T[P]
          : never;
    }
  : {
      [P in keyof T | Path]: P extends Path ? Value : P extends keyof T ? T[P] : never;
    };

/** Sets a value under path by mutating object / tree */
export const set =
  <const Path extends string, const Value>(path: Path, value: Value) =>
  <const T extends Tree>(tree: T) => {
    const keys = path.split(".");
    const result: any = tree;

    let target = result;

    let i = 0;
    for (; i < keys.length - 1; i++) {
      const key = keys[i]!;
      target[key] = target[key] !== null && typeof target[key] === "object" ? target[key] : {};
      target = target[key];
    }

    target[keys[i]!] = value;

    return result as Set<T, Path, Value>;
  };

export default set;
