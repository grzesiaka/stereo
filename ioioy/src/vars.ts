import { Simplify } from "type-fest";
import type { ij_Project, KeyValues$Object } from "proyij";
import { ARR, Cb, Dispose } from "~types";
import cId, { type CtxIdConstraint } from "jsyoyo/ctxid";

import type { IO, IOs$FlatTypes, IdIOs } from "./io";
import iosById, { type IOsById } from "./ios-by-id";
import { __, mb } from "jsyoyo";
import { OP } from "xpresyo";
import D, { DISPOSE, type Disposyo } from "disposyo";
import type { Var } from "./var";

export type And_Vars_X<IOs extends IdIOs> = Simplify<KeyValues$Object<ij_Project<["Id", "X"], IOs$FlatTypes<IOs>>>>;

export interface And_Vars<
  Ctx extends CtxIdConstraint = __,
  IOs extends IdIOs = IdIOs,
  NullableValues extends ARR<__ | null> = [],
> extends Var<Ctx, And_Vars_X<IOs> | NullableValues[number], Partial<And_Vars_X<IOs>> | NullableValues[number], IOs> {
  IOs: IOsById<IOs>;
  [DISPOSE]: Disposyo<Dispose[]>;
}

export const Vars =
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx) =>
  <const IOs extends IdIOs, NullableValues extends ARR<__ | null> = []>(
    IOs: IOs,
    ..._extra: NullableValues
  ): And_Vars<Ctx, IOs, NullableValues> => {
    let updating = false;
    const nullable = [] as [NullableValues[number]?];
    const I = (x: Partial<And_Vars_X<IOs>> | NullableValues[number]) => {
      updating = true;
      if (x) {
        mb((v, k) => ($.IOs[k] as IO).I(v))(x);
        nullable.pop();
      } else {
        nullable[0] = x;
      }
      updating = false;
      handleEmit();
      return x;
    };
    const handleEmit = () => {
      // Get it once for better performance; TODO make the corrensponding type readonly
      const x = $.X;
      // If `$.I` called from the callback a feedback loop may explode; the app logic should not allow such behavior
      $.OO.forEach((c) => c(x));
    };
    const $ = OP("VR")(IOs)({
      I,
      get X() {
        return nullable.length ? nullable[0] : mb((v) => (v as IO).X)($.IOs);
      },
      O: cId(
        // @ts-expect-error upon `pnpm refresh` it is reported; but sometimes in IDE it disappears
        // oxlint-disable-next-line no-unused-vars apparently skipInitial is not used; seems to be a bug in oxc
        (c?: Cb<any>, skipInitial = false) => (!c ? $.X : ($.OO.add(c), !skipInitial && c($.X), () => $.OO.delete(c))),
        L,
      ),
      OO: new Set(),
      [DISPOSE]: D() as Disposyo<Dispose[]>,
    }) as And_Vars<Ctx, IOs, NullableValues> & { X: And_Vars_X<IOs> | NullableValues[number] };
    $.IOs = iosById(IOs, (io) => $[DISPOSE].__.push(io.O(() => !updating && handleEmit(), 1)));
    return $;
  };

export default Vars;
