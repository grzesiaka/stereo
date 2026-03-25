import { Simplify } from "type-fest";
import type { ij_Project, KeyValues$Object } from "proyij";
import { __, Cb, Dispose } from "~types";
import cId, { type CtxIdConstraint } from "~js/ctxid";

import type { IO, IOs$FlatTypes } from "./io";
import iosById, { type IOsById } from "./ios-by-id";
import { mb } from "~js";
import D, { type Disposyo } from "disposyo";
import type { IdVars, Var } from "./var";

export type And_Vars_X<IOs extends IdVars> = Simplify<KeyValues$Object<ij_Project<["Id", "X"], IOs$FlatTypes<IOs>>>>;

export interface And_Vars<Ctx extends CtxIdConstraint = __, IOs extends IdVars = IdVars> extends Var<
  Ctx,
  And_Vars_X<IOs>
> {
  /** Partial input */
  I_: <const X extends Partial<And_Vars_X<IOs>>>(x: X) => X;
  IOs: IOs & { $: IOsById<IOs> };
  D: Disposyo<Dispose[]>;
}

export const AndVars =
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx) =>
  <const IOs extends IdVars>(IOs: IOs): And_Vars<Ctx, IOs> => {
    let updating = false;
    const I = (x: Partial<And_Vars_X<IOs>>) => {
      updating = true;
      mb((v, k) => ($.IOs.$[k] as IO).I(v))(x);
      updating = false;
      handleEmit();
      return x;
    };
    const $ = {
      I: I as And_Vars<Ctx, IOs>["I"],
      I_: I,
      get X() {
        return mb((v) => (v as IO).X)($.IOs.$);
      },
      O: cId((c: Cb<any>) => (!c ? $.X : ($.OO.add(c), () => $.OO.delete(c))), L),
      OO: new Set(),
      IOs,
      D: D(),
    } as And_Vars<Ctx, IOs> & { X: And_Vars_X<IOs> };

    let handleEmit = () => {}; // no-op before initial register phase not completed
    $.IOs.$ = iosById(IOs, (io) => $.D.__[1].push(io.O(() => !updating && handleEmit())));
    handleEmit = () => $.OO.forEach((c) => c($.X));
    handleEmit(); // initial emit
    return $;
  };

export default AndVars;
