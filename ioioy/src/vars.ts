import { Simplify } from "type-fest";
import type { ij_Project, KeyValues$Object } from "proyij";
import { __, Cb, Dispose } from "~types";
import cId, { type CtxIdConstraint } from "jsyoyo/ctxid";

import type { IO, IOs$FlatTypes, IdIOs } from "./io";
import iosById, { type IOsById } from "./ios-by-id";
import { mb } from "jsyoyo";
import { OP } from "xpresyo";
import D, { DISPOSE, type Disposyo } from "disposyo";
import type { Var } from "./var";

export type And_Vars_X<IOs extends IdIOs> = Simplify<KeyValues$Object<ij_Project<["Id", "X"], IOs$FlatTypes<IOs>>>>;

export interface And_Vars<Ctx extends CtxIdConstraint = __, IOs extends IdIOs = IdIOs> extends Var<
  Ctx,
  And_Vars_X<IOs>,
  Partial<And_Vars_X<IOs>>,
  IOs
> {
  IOs: IOsById<IOs>;
  [DISPOSE]: Disposyo<Dispose[]>;
}

export const Vars =
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx) =>
  <const IOs extends IdIOs>(IOs: IOs): And_Vars<Ctx, IOs> => {
    let updating = false;
    const I = (x: Partial<And_Vars_X<IOs>>) => {
      updating = true;
      mb((v, k) => ($.IOs[k] as IO).I(v))(x);
      updating = false;
      handleEmit();
      return x;
    };
    const handleEmit = () => $.OO.forEach((c) => c($.X));
    const $ = OP("VR")(IOs)({
      I,
      get X() {
        return mb((v) => (v as IO).X)($.IOs);
      },
      O: cId(
        // @ts-expect-error ???
        // oxlint-disable-next-line no-unused-vars apparently skipInitial is not used; seems to be a bug in oxc
        (c?: Cb<any>, skipInitial = false) => (!c ? $.X : ($.OO.add(c), !skipInitial && c($.X), () => $.OO.delete(c))),
        L,
      ),
      OO: new Set(),
      [DISPOSE]: D() as Disposyo<Dispose[]>,
    }) as And_Vars<Ctx, IOs> & { X: And_Vars_X<IOs> };
    $.IOs = iosById(IOs, (io) => $[DISPOSE].__.push(io.O(() => !updating && handleEmit(), 1)));
    return $;
  };

export default Vars;
