import { Simplify } from "type-fest";
import type { ij_Project, KeyValues$Object } from "proyij";
import { __, Cb } from "~types";

import { ctx, IdIOs, IO, IOs$IOXIds } from "./io";

export type AND_I<IOs extends IdIOs> = Simplify<KeyValues$Object<ij_Project<["Id", "I"], IOs$IOXIds<IOs>>>>;
// export type AND_I<IOs extends IdIOs> = IOs$IOXIds<IOs>;
export type AND_O<IOs extends IdIOs> = Simplify<KeyValues$Object<ij_Project<["Id", "O"], IOs$IOXIds<IOs>>>>;
export type AND_X<IOs extends IdIOs> = Simplify<KeyValues$Object<ij_Project<["Id", "X"], IOs$IOXIds<IOs>>>>;

export type AND_IOs<Ctx = unknown, IOs extends IdIOs = IdIOs> = IO<Partial<AND_I<IOs>>, AND_O<IOs>, AND_X<IOs>, Ctx> & {
  ios: IOs;
  OO: Set<Cb<AND_O<IOs>>>;
};

export const And =
  <const Ctx = __>(L?: Ctx) =>
  <const IOs extends IdIOs>(ios: IOs) => {
    const $ = {
      ios,
      OO: new Set(),
      I: ctx((x: any) => x, L),
      O: ctx((x?: any) => () => 1, L),
    } as AND_IOs<Ctx, IOs>;
    return $;
  };

export default And;

// type T = [IO<"IN", "OUT", "X", "id0">, IO<"IN1", "OUT1", "X1", "id1">];
