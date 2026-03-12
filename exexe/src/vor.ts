import type { Simplify } from "type-fest";
import { __, Fn$I, Fn$O } from "~js";
import type { VarIO } from "./var";

export type VarIOs = readonly VarIO[];
export type VarIOsById<Vs, Acc = {}> = Vs extends readonly [infer H, ...infer R]
  ? VarIOsById<
      R,
      Acc &
        (H extends { Id: infer Id extends PropertyKey } ? (Acc extends { [i in Id]: any } ? {} : { [k in Id]: H }) : {})
    >
  : Simplify<Acc>;
export type VarIOs$Is<Vs extends VarIOs> = {
  [k in keyof VarIOsById<Vs>]: [k, Fn$I<VarIOsById<Vs>[k]>[0]];
}[keyof VarIOsById<Vs>];
export type VarIOs$Os<Vs extends VarIOs> = Vs extends readonly [infer H, ...infer R] ? Fn$O<H> | VarIOs$Os<R> : never;
export type VarIOs$V<Vs extends VarIO> = Vs extends readonly [infer H, ...infer R]
  ? VarIOs$V<H> extends never
    ? VarIOs$V<R>
    : VarIOs$V<H>
  : never;

export type Vor<Vs extends VarIOs> = VarIO<VarIOs$Is<Vs>, VarIOs$Os<Vs>, { ".": Vs }>;

export const Vor = <const Vs extends VarIOs>(..._: Vs): Vor<Vs> => 1 as any;

export default Vor;
