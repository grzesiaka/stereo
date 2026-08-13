import { describe } from "~testing";
import * as TR from "typier";
import { Parse } from "typebox/value";
import { fromTypier as $, TYPIER } from "../src";
import { __ } from "jsyoyo";

const T0 = TR.fromTree({
  B: TR.B(true),
  N: TR.N(),
  Str: TR.S({ minLength: 2 }),
  Str2: TR.S(""),
});
const O = TR.O(T0.B, T0.N, T0.Str, T0.Str2)("OBJ");
const U = TR.U(T0.B, T0.N, T0.Str, T0.Str2)("UNI");
const ok = Parse(O, { B: true, N: 0, Str: "22", Str2: "" });
const init = {
  B: ok.B,
  N: __,
  Str: __,
  Str2: ok.Str2,
};

describe($, ({ eq, res }) => ({
  init: () => {
    eq(ok, { B: true, N: 0, Str: "22", Str2: "" } as never);
  },
  atoms: () => {
    eq(
      {
        B: $(T0.B).X,
        N: $(T0.N).X,
        Str: $(T0.Str).X,
        Str2: $(T0.Str2).X,
      },
      init,
    );
  },
  object: () => {
    const $O = $(O);
    eq($O.X, init);
    $O.I(ok);
    eq($O.X, ok);
  },

  union_empty: () => {
    const $U = $(TR.U()("[]"));
    eq($U.X, __ as never);
  },

  union: () => {
    const $U = $(U);
    eq($U.X, ["B", ok.B]);
    $U.I(["Str", "333" as any]);
    eq($U.X, ["Str", "333" as any]);
  },

  union_with_null: () => {
    const _U = TR.U(TR.Null(), T0.B, TR.Null())("UNI");
    const U = $(_U);

    eq(U.O[TYPIER], _U);
    eq(Object.keys(U.IOs), ["B"]);
    U.IOs.B.O[TYPIER] = T0.B;

    const r = res();
    U.O(r.add);
    r.eq([]);
    eq(U.X, null);
    eq(U.$1, null);

    U.I(["B", false as any]);
    eq(U.$1, U.IOs.B);
    U.IOs.B.I(ok.B);
    eq(U.$1, U.IOs.B);
    U.I(null);
    eq(U.$1, null);
    r.eq([["B", false], ["B", true], null]);
  },
  nested: () => {
    const _O2 = TR.O(O.$("_1"), O.$("?_2"), U.$("U1"), U.$("?U2"))("O2");
    const O2 = $(_O2);
    eq(O2.X, { _1: init, _2: init, U1: ["B", ok.B], U2: ["B", ok.B] });
    O2.I({ _2: __, U1: ["Str", "4444" as any], U2: __ });
    eq(O2.X, { _1: init, _2: __, U1: ["Str", "4444" as any], U2: __ });
  },
}));
