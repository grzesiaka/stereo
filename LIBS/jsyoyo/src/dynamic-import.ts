import { a } from "objoy";

export const dynImport =
  <T>() =>
  <const Name extends string, const Path extends string = "./index.mjs", S = T>(
    n: Name,
    p = "./index.mjs" as Path,
    map?: (t: T) => S,
  ) =>
    a(() => (map ? import(p).then(map) : import(p)) as Promise<S>, {
      $dynamic: [n, p, map],
    });

export default dynImport;
