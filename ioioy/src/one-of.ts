import { __, Cb, Dispose } from "~types";
import type { ij_Project } from "proyij";
import cId, { type CtxIdConstraint } from "~js/ctxid";
import D, { type Disposyo } from "disposyo";
import { OP, WithOP } from "~js";

import type { IdIOs, IO, IOs$FlatTypes } from "./io";
import iosById, { type IOsById } from "./ios-by-id";

export type OneOf_I<IOs extends IdIOs> = ij_Project<["Id", "I"], IOs$FlatTypes<IOs>>[number];
export type OneOf_O<IOs extends IdIOs> = ij_Project<["Id", "O"], IOs$FlatTypes<IOs>>[number];
export type OneOf_X<IOs extends IdIOs> = ij_Project<["Id", "X"], IOs$FlatTypes<IOs>>[number];

export interface OneOf_IOs<Ctx extends CtxIdConstraint = __, IOs extends IdIOs = IdIOs>
  extends WithOP<"1of", IOs>, IO<OneOf_I<IOs>, OneOf_O<IOs>, OneOf_X<IOs>, Ctx> {
  $1: IOs[number];
  OO: Set<Cb<OneOf_O<IOs>>>;
  IOs: IOsById<IOs>;
  D: Disposyo<Dispose[]>;
}

export const OneOf =
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx) =>
  <const IOs extends IdIOs>(IOs: IOs): OneOf_IOs<Ctx, IOs> => {
    const O = (io: IOs[number]) => {
      $.D();
      if (io) {
        $.$1 = io;
        $.D = D([io.O((v) => $.OO.forEach((c) => c([$.$1.O.Id, v])))]);
      }
    };
    const I = (x: OneOf_I<IOs>) => {
      const k = x[0] as keyof typeof $.IOs;
      k !== $.$1.O.Id && O($.IOs[k]);
      $.$1.I(x[1]);
      return x;
    };
    const $ = OP("1of")(IOs)({
      I,
      get X() {
        return [$.$1.O.Id, $.$1.X];
      },
      O: cId((c: Cb<any>) => (!c ? $.X : ($.OO.add(c), () => $.OO.delete(c))), L),
      OO: new Set(),
      D: D(),
    }) as OneOf_IOs<Ctx, IOs> & { X: OneOf_X<IOs> };
    $.IOs = iosById(IOs); // not sure if needed
    IOs[0] && O(IOs[0]); // allow specifying initial selection (if needed; actually one can always pass something like never as 0th IO)
    return $;
  };

export default OneOf;
