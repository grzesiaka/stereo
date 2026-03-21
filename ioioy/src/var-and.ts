import { Simplify } from "type-fest";
import type { ij_Project, KeyValues$Object } from "proyij";
import { __, Cb, Dispose } from "~types";
import cId, { type CtxIdConstraint } from "~js/ctxid";

import type { IO, IOs$FlatTypes } from "./io";
import iosById, { type IOsById } from "./ios-by-id";
import { mb } from "~js";
import D, { type Disposyo } from "disposyo";
import type { IdVars } from "./var";

export type AND_I<IOs extends IdVars> = Simplify<KeyValues$Object<ij_Project<["Id", "I"], IOs$FlatTypes<IOs>>>>;
export type AND_O<IOs extends IdVars> = Simplify<KeyValues$Object<ij_Project<["Id", "O"], IOs$FlatTypes<IOs>>>>;
export type AND_X<IOs extends IdVars> = Simplify<KeyValues$Object<ij_Project<["Id", "X"], IOs$FlatTypes<IOs>>>>;

export type AND_IOs<Ctx extends CtxIdConstraint = __, IOs extends IdVars = IdVars> = IO<
  Partial<AND_I<IOs>>,
  AND_O<IOs>,
  AND_X<IOs>,
  Ctx
> & {
  OO: Set<Cb<AND_O<IOs>>>;
  IOs: IOs;
  ById: IOsById<IOs>;
};

export const And =
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx) =>
  <const IOs extends IdVars>(IOs: IOs): AND_IOs<Ctx, IOs> => {
    let updating = false;
    let O = {} as AND_O<IOs>;

    let handleEmit = () => {};
    const $ = {
      I: cId((x: Partial<AND_I<IOs>>) => {
        updating = true;
        mb((v, k) => ((O[k] = v), ($.ById[k] as IO).I(v)))(x);
        updating = false;
        handleEmit();
        return x;
      }, L),
      get X() {
        return mb((v) => (v as IO).X)($.ById);
      },
      O: cId((c: Cb<any>) => (!c ? $.X : ($.OO.add(c), () => $.OO.delete(c))), L),
      OO: new Set(),
      IOs,
      D: D(),
    } as AND_IOs<Ctx, IOs> & { X: AND_X<IOs>; D: Disposyo<Dispose[]> };
    $.ById = iosById(IOs, (io, id) => $.D.__[1].push(io.O((x) => (((O as any)[id] = x), !updating && handleEmit()))));
    handleEmit = () => {
      $.OO.forEach((c) => c(O));
    };
    handleEmit();
    return $;
  };

export default And;
