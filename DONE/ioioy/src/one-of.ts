import { __, ARR, Cb } from "~types";
import type { ij_Project } from "proyij";
import cId, { type CtxIdConstraint } from "jsyoyo/ctxid";
import D, { DISPOSE, type Disposyo, Dispose } from "disposyo";
import { OP, WithOP } from "jsyoyo";

import type { IdIOs, IO, IOs$FlatTypes } from "./io";
import iosById, { type IOsById } from "./ios-by-id";

export type OneOf_I<IOs extends IdIOs> = ij_Project<["Id", "I"], IOs$FlatTypes<IOs>>[number];
export type OneOf_O<IOs extends IdIOs> = ij_Project<["Id", "O"], IOs$FlatTypes<IOs>>[number];
export type OneOf_X<IOs extends IdIOs> = ij_Project<["Id", "X"], IOs$FlatTypes<IOs>>[number];

export interface OneOf_IOs<
  Ctx extends CtxIdConstraint = __,
  IOs extends IdIOs = IdIOs,
  NullableValues extends ARR<__ | null> = [],
>
  extends
    WithOP<"1OF", IOs>,
    IO<
      OneOf_I<IOs> | NullableValues[number],
      OneOf_O<IOs> | NullableValues[number],
      OneOf_X<IOs> | NullableValues[number],
      Ctx
    > {
  $1: IOs[number] | NullableValues[number];
  OO: Set<Cb<OneOf_O<IOs> | NullableValues[number]>>;
  IOs: IOsById<IOs>;
  [DISPOSE]: Disposyo<Dispose[]> | Dispose;
}

export const OneOf =
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx) =>
  <const IOs extends IdIOs, NullableValues extends ARR<__ | null> = []>(
    IOs: IOs,
    ..._nullable: NullableValues
  ): OneOf_IOs<Ctx, IOs, NullableValues> => {
    const nullable = (IOs.length ? [] : [void 0]) as [NullableValues[number]?];
    const O = (io: IOs[number] | NullableValues[number]) => {
      $.$1 = io;
      $[DISPOSE]();
      if (!io) {
        nullable[0] = io;
        $[DISPOSE] = () => 0;
        return $.OO.forEach((c) => c(io));
      }
      nullable.pop();
      const Id = io.O.Id;
      $[DISPOSE] = D(io.O((v) => $.OO.forEach((c) => c([Id, v])), 1));
    };
    const I = (x: OneOf_I<IOs> | NullableValues[number]) => {
      if (!x) {
        O(x);
        return x;
      }
      const k = x[0] as keyof typeof $.IOs;
      k !== $.$1?.O.Id && O($.IOs[k]);
      $.$1!.I(x[1]);
      return x;
    };
    const $ = OP("1OF")(IOs)({
      I,
      get X() {
        return nullable.length ? nullable[0] : [$.$1!.O.Id, $.$1!.X];
      },

      O: cId(
        // @ts-expect-error upon `pnpm refresh` it is reported; but sometimes in IDE it disappears
        // oxlint-disable-next-line no-unused-vars apparently skipInitial is not used; seems to be a bug in oxc
        (c: Cb<any>, skipInitial = true) => (!c ? $.X : ($.OO.add(c), !skipInitial && c($.X), () => $.OO.delete(c))),
        L,
      ),
      OO: new Set(),
      [DISPOSE]: D() as Disposyo<Dispose[]>,
    }) as OneOf_IOs<Ctx, IOs, NullableValues> & { X: OneOf_X<IOs> | NullableValues[number] };
    $.IOs = iosById(IOs);
    IOs[0] && O(IOs[0]);
    return $;
  };

export default OneOf;
