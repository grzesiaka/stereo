import { Get, Paths } from "type-fest";
import { Tree } from "./types";
import { a } from "jsyoyo";

export type { Get };

export type Getter<T extends Tree<any>> = ReturnType<typeof get<T>>;

export const get = <T extends Tree<any>>(tree: T, cache = {} as Record<string, unknown>) =>
  a(
    <Path extends Paths<T, { leavesOnly: true }>>(op: Path): Get<T, Path> => {
      if (cache[op]) return cache[op] as Get<T, Path>;
      const parts = op.split(".");
      let i = tree as any;
      for (const p of parts) {
        i = i[p];
      }
      cache[op] = i;
      return i;
    },
    { cache },
  );

export default get;
