import { Simplify } from "type-fest";
import { DynamicExport, DynamicExports } from "./export";
import { Dict } from "~types";

type _DynImport<Es extends DynamicExports> = Es extends readonly [
  infer H extends DynamicExport,
  ...infer R extends DynamicExports,
]
  ? { [k in H["Id"]]: H } & _DynImport<R>
  : {};

export type DynImport<Es extends DynamicExports> = Simplify<_DynImport<Es>>;

export const DynImport = <const Es extends DynamicExports>(...es: Es) =>
  es.reduce((a, n) => (((a as Dict)[n.Id] = n), a), {}) as DynImport<Es>;

export default DynImport;
