import { Simplify } from "type-fest";
import type { ij_Project, KeyValues$Object } from "proyij";
import { __, Cb, Dispose } from "~types";
import cId, { type CtxIdConstraint } from "~js/ctxid";

import type { IdIOs, IO, IOs$FlatTypes } from "./io";
import byId, { type IOsById } from "./by-id";
import { mb } from "~js";

export type AND_I<IOs extends IdIOs> = Simplify<KeyValues$Object<ij_Project<["Id", "I"], IOs$FlatTypes<IOs>>>>;
export type AND_O<IOs extends IdIOs> = Simplify<KeyValues$Object<ij_Project<["Id", "O"], IOs$FlatTypes<IOs>>>>;
export type AND_X<IOs extends IdIOs> = Simplify<KeyValues$Object<ij_Project<["Id", "X"], IOs$FlatTypes<IOs>>>>;

export type AND_IOs<Ctx extends CtxIdConstraint = __, IOs extends IdIOs = IdIOs> = IO<
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
  <const IOs extends IdIOs>(IOs: IOs): AND_IOs<Ctx, IOs> => {
    let updating = false;
    let O = {} as AND_O<IOs>;

    const handleEmit = (x: any) => {
      if ($._Fired) {
        mb((_, k) => $._Fired!.add(k))(x);
        if ($._Fired!.size === IOs.length) {
          delete $._Fired;
          $.I({});
        }
      } else {
        $.OO.forEach((c) => c(O));
      }
    };
    const $ = {
      I: cId((x: Partial<AND_I<IOs>>) => {
        updating = true;
        mb((v, k) => ((O[k] = v), ($.ById[k] as IO).I(v)))(x);
        updating = false;
        handleEmit(x);
        return x;
      }, L),
      O: cId((c: Cb<any>) => (!c ? $.X : ($.OO.add(c), () => $.OO.delete(c))), L),
      OO: new Set(),
      IOs,
      _OO: [] as Dispose[],
      get X() {
        return mb((v) => (v as IO).X)($.ById);
      },
    } as AND_IOs<Ctx, IOs> & { X: AND_X<IOs>; _OO: Dispose[]; _Fired?: Set<PropertyKey> };
    $.ById = byId(IOs, (io, id) => $._OO.push(io.O((x) => (((O as any)[id] = x), !updating && handleEmit({ id: x })))));
    return $;
  };

export default And;
