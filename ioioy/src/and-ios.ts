import { Simplify } from "type-fest";
import { __, Cb, Dispose } from "~types";
import type { ij_Project, KeyValues$Object } from "proyij";
import cId, { type CtxIdConstraint } from "~js/ctxid";
import D, { type Disposyo } from "disposyo";
import { mb } from "~js";

import type { IdIOs, IO, IOs$FlatTypes } from "./io";
import iosById, { type IOsById } from "./ios-by-id";

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
  D: Disposyo<Dispose[]>;
};

export const AndIOs =
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx) =>
  <const IOs extends IdIOs>(IOs: IOs): AND_IOs<Ctx, IOs> => {
    let updating = false;
    let O = {} as AND_O<IOs>;

    let handleEmit = (x?: Partial<AND_I<IOs>>) => {
      mb((_, k) => $._Fired!.add(k))(x!);
      if ($._Fired!.size === IOs.length) {
        delete $._Fired; // once all IOs emitted at least one, the AndIOs starts emitting
        handleEmit = () => $.OO.forEach((c) => c(O));
        handleEmit();
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
      O: cId((c: Cb) => (!c ? $.X : ($.OO.add(c), () => $.OO.delete(c))), L),
      OO: new Set(),
      IOs,
      D: D(),
      get X() {
        return mb((v) => (v as IO).X)($.ById);
      },
      _Fired: new Set(),
    } as AND_IOs<Ctx, IOs> & { X: AND_X<IOs>; _Fired?: Set<PropertyKey> };
    $.ById = iosById(IOs, (io, id) =>
      $.D.__[1].push(io.O((x) => (((O as any)[id] = x), !updating && handleEmit({ [id]: x } as Partial<AND_I<IOs>>)))),
    );
    return $;
  };

export default AndIOs;
