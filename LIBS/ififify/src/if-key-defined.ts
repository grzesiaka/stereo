import { $$ } from "~types";
import { __, id } from "./-";

export const ifKeyDefined =
  <K extends string>(key: K) =>
  <F extends { [k in K]?: unknown }, R = $$<F[K]>, P = __>(
    obj: F,
    defined = id as (x: $$<F[K]>, o: Omit<F, K> & { [k in K]: $$<F[K]> }) => R,
    notDefined = id as () => P,
  ) =>
    obj[key] !== __ ? defined(obj[key] as $$<F[K]>, obj as Omit<F, K> & { [k in K]: $$<F[K]> }) : notDefined();
