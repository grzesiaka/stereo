import { a } from "objoy";
import { ARR, Fn, Fn$O } from "~types";
import { __ } from "../deps";

export interface NamedDynamicExport<N extends string = string, P extends string = string, M = unknown> {
  (): Promise<M>;
  Id: N;
  path: P;
}

export interface MappedDynamicExport<
  N extends string = string,
  P extends string = string,
  M = unknown,
  Pre = unknown,
> extends NamedDynamicExport<N, P, M> {
  map: (p: Pre) => M;
}

export type DynamicExport = NamedDynamicExport | MappedDynamicExport;
export type DynamicExports = ARR<DynamicExport>;

export const DynExport =
  <T>() =>
  <Name extends string, Map extends __<Fn<[T], unknown>> = __<Fn<[T], unknown>>, Path extends string = Name>(
    Id: Name,
    map?: Map,
    path = Id as never as Path,
  ) => {
    const $ = a(() => (map ? import($.path).then(map) : import($.path)), {
      Id,
      path,
      map,
    }) as __ extends Map ? NamedDynamicExport<Name, Path, T> : MappedDynamicExport<Name, Path, Fn$O<Map>, T>;
    return $;
  };

export default DynExport;
