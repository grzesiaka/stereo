import { __, Cb } from "~js";
import { ctx, IO } from "./io";

export type Var<X = unknown, Ctx = unknown> = IO<X, X, X, Ctx, { CBs: Set<Cb<X>> }>;

export const Var = <X, Ctx = __>(x: X, L?: Ctx): Var<X, Ctx> => {
  const $ = {
    CBs: new Set<Cb<X>>(),
    I: ctx((x: X) => (($.I.V = x), $.CBs.forEach((c) => c(x)), x), L, { V: x }),
    O: (c?: Cb<X>) => (!c ? $.I.V : ($.CBs.add(c), c($.I.V as X), () => $.CBs.delete(c))),
  } as Var<X, Ctx>;
  return $;
};

export default Var;
