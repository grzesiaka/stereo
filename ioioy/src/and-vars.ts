import { Simplify } from "type-fest";
import type { ij_Project, KeyValues$Object } from "proyij";
import { __, Cb, Dispose } from "~types";
import cId, { type CtxIdConstraint } from "~js/ctxid";

import type { IO, IOs$FlatTypes } from "./io";
import iosById, { type IOsById } from "./ios-by-id";
import { mb } from "~js";
import D, { type Disposyo } from "disposyo";
import type { IdVars } from "./var";

export type VAR_AND_X<IOs extends IdVars> = Simplify<KeyValues$Object<ij_Project<["Id", "X"], IOs$FlatTypes<IOs>>>>;

export type AND_VARs<Ctx extends CtxIdConstraint = __, IOs extends IdVars = IdVars> = IO<
  Partial<VAR_AND_X<IOs>>,
  VAR_AND_X<IOs>,
  VAR_AND_X<IOs>,
  Ctx
> & {
  OO: Set<Cb<VAR_AND_X<IOs>>>;
  IOs: IOs;
  ById: IOsById<IOs>;
  D: Disposyo<Dispose[]>;
};

export const AndVars =
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx) =>
  <const IOs extends IdVars>(IOs: IOs): AND_VARs<Ctx, IOs> => {
    let updating = false;
    const $ = {
      I: cId((x: Partial<VAR_AND_X<IOs>>) => {
        updating = true;
        mb((v, k) => ($.ById[k] as IO).I(v))(x);
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
    } as AND_VARs<Ctx, IOs> & { X: VAR_AND_X<IOs> };

    let handleEmit = () => {}; // no-op before initial register phase not completed
    $.ById = iosById(IOs, (io) => $.D.__[1].push(io.O(() => !updating && handleEmit())));
    handleEmit = () => $.OO.forEach((c) => c($.X));
    handleEmit(); // initial emit
    return $;
  };

export default AndVars;
