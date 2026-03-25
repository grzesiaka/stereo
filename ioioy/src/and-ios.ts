import { Simplify } from "type-fest";
import { __, Cb, Dispose } from "~types";
import type { ij_Project, KeyValues$Object } from "proyij";
import cId, { type CtxIdConstraint } from "~js/ctxid";
import D, { type Disposyo } from "disposyo";
import { mb } from "~js";

import type { IdIOs, IO, IOs$FlatTypes } from "./io";
import iosById, { type IOsById } from "./ios-by-id";

export type And_I<IOs extends IdIOs> = Simplify<KeyValues$Object<ij_Project<["Id", "I"], IOs$FlatTypes<IOs>>>>;
export type And_O<IOs extends IdIOs> = Simplify<KeyValues$Object<ij_Project<["Id", "O"], IOs$FlatTypes<IOs>>>>;
export type And_X<IOs extends IdIOs> = Simplify<KeyValues$Object<ij_Project<["Id", "X"], IOs$FlatTypes<IOs>>>>;

export interface And_IOs<Ctx extends CtxIdConstraint = __, IOs extends IdIOs = IdIOs> extends IO<
  Partial<And_I<IOs>>,
  And_O<IOs>,
  And_X<IOs>,
  Ctx
> {
  OO: Set<Cb<And_O<IOs>>>;
  IOs: IOs & { $: IOsById<IOs> };
  D: Disposyo<Dispose[]>;
}

export const AndIOs =
  <const Ctx extends CtxIdConstraint = __>(L?: Ctx) =>
  <const IOs extends IdIOs>(IOs: IOs): And_IOs<Ctx, IOs> => {
    let updating = false;
    let O = {} as And_O<IOs>;

    let handleEmit = (x?: Partial<And_I<IOs>>) => {
      mb((_, k) => $._Fired!.add(k))(x!);
      if ($._Fired!.size === IOs.length) {
        delete $._Fired; // once all IOs emitted at least one, the AndIOs starts emitting
        handleEmit = () => $.OO.forEach((c) => c(O));
        handleEmit();
      }
    };
    const $ = {
      I: (x: Partial<And_I<IOs>>) => {
        updating = true;
        mb((v, k) => ((O[k] = v), ($.IOs.$[k] as IO).I(v)))(x);
        updating = false;
        handleEmit(x);
        return x;
      },
      O: cId((c: Cb) => (!c ? $.X : ($.OO.add(c), () => $.OO.delete(c))), L),
      OO: new Set(),
      IOs,
      D: D(),
      get X() {
        return mb((v) => (v as IO).X)($.IOs.$);
      },
      _Fired: new Set(),
    } as And_IOs<Ctx, IOs> & { X: And_X<IOs>; _Fired?: Set<PropertyKey> };
    $.IOs.$ = iosById(IOs, (io, id) =>
      $.D.__[1].push(io.O((x) => (((O as any)[id] = x), !updating && handleEmit({ [id]: x } as Partial<And_I<IOs>>)))),
    );
    return $;
  };

export default AndIOs;
