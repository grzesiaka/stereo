import { __, Cb, Dispose } from "~types";
import type { ij_Project } from "proyij";
import cId, { type CtxIdConstraint } from "jsyoyo/ctxid";
import D, { DISPOSE, type Disposyo } from "disposyo";
import { OP, WithOP } from "xpresyo";

import type { IdIOs, IO, IOs$FlatTypes } from "./io";
import iosById, { type IOsById } from "./ios-by-id";

export type OneOf_I<IOs extends IdIOs> = ij_Project<["Id", "I"], IOs$FlatTypes<IOs>>[number];
export type OneOf_O<IOs extends IdIOs> = ij_Project<["Id", "O"], IOs$FlatTypes<IOs>>[number];
export type OneOf_X<IOs extends IdIOs> = ij_Project<["Id", "X"], IOs$FlatTypes<IOs>>[number];

export interface OneOf_IOs<Ctx extends CtxIdConstraint = __, IOs extends IdIOs = IdIOs>
  extends WithOP<"1OF", IOs>, IO<OneOf_I<IOs>, OneOf_O<IOs>, OneOf_X<IOs>, Ctx> {
  $1: IOs[number];
  OO: Set<Cb<OneOf_O<IOs>>>;
  IOs: IOsById<IOs>;
  [DISPOSE]: Disposyo<Dispose[]>;
}

export const OneOf =
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx) =>
  <const IOs extends IdIOs>(IOs: IOs): OneOf_IOs<Ctx, IOs> => {
    const O = (io: IOs[number]) => {
      $.$1 = io;
      $[DISPOSE]();
      $[DISPOSE] = D(io.O((v) => $.OO.forEach((c) => c([$.$1.O.Id, v])), 1));
    };
    const I = (x: OneOf_I<IOs>) => {
      const k = x[0] as keyof typeof $.IOs;
      k !== $.$1.O.Id && O($.IOs[k]);
      $.$1.I(x[1]);
      return x;
    };
    const $ = OP("1OF")(IOs)({
      I,
      get X() {
        return [$.$1.O.Id, $.$1.X];
      },

      O: cId(
        // oxlint-disable-next-line no-unused-vars apparently skipInitial is not used; seems to be a bug in oxc
        (c: Cb<any>, skipInitial = true) => (!c ? $.X : ($.OO.add(c), !skipInitial && c($.X), () => $.OO.delete(c))),
        L,
      ),
      OO: new Set(),
      [DISPOSE]: D() as Disposyo<Dispose[]>,
    }) as OneOf_IOs<Ctx, IOs> & { X: OneOf_X<IOs> };
    $.IOs = iosById(IOs);
    IOs[0] && O(IOs[0]);
    return $;
  };

export default OneOf;
