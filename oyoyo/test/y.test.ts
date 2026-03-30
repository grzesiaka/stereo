import { describe } from "~testing";

import { IN } from "../src/I";
import { F } from "../src/F";
import { S } from "../src/S";
import { UP } from "../src/meta";
import { __ } from "jsyoyo";

describe(IN, ({ eq, res }) => ({
  no_id: () => {
    const i = IN(7)();
    const re = res();
    const x = i(re.add);
    x.i(2);
    re.eq([7, 2]);
    eq("id" in x, false);
  },

  empty_id: () => {
    const i = IN("", "")();
    const re = res();
    const x = i(re.add);
    x.i("1");
    re.eq(["", "1"]);
    eq(x.id, "");
  },

  with_id: () => {
    const i = IN("", "/id/")();
    const re = res();
    const x = i(re.add);
    x.i("1");
    re.eq(["", "1"]);
    eq(x.id, "/id/");
  },
}));

describe(F, ({ eq }) => ({
  simple_flow: () => {
    const id = <X>(x: X) => x;
    const toString = <X>(n: X) => `${n}`;
    const toStringF = F.ify(toString);
    const i = IN.L({ a: "A", toString, dup: <X>(x: X) => [x, x] as [X, X] })(1, "i")(
      toStringF,
      F(parseFloat),
      F((x) => [x, x]),
      F(id),
      UP(() => ({ id: "UPPED" })),
      F.L(($) => $.dup),
      F.seL("toString"),
    );

    const re = [] as string[];
    const x = i((x) => re.push(x));

    x.p.p.p.p.p.p.i(2);
    eq(x.p.p.id)("UPPED");
    eq(x.p.p.p.p.p.p.id)("i");
    eq(re)(["1,1,1,1", "2,2,2,2"]);
  },
  undefined_ignored: () => {
    const i = IN(__ as __<number>)(F());
    const re = [] as unknown[];
    const x = i((x) => re.push(x));
    x.p.i(7);
    x.p.i(undefined);
    eq(re)([7]);
  },
  compose_and_compose_async: async () => {
    const L = {
      toString: <X>(x: X) => `${x}`,
      toPromise: <X>(x: X) => Promise.resolve(x),
      error: <X>(x: X) => (x === "1" ? new Error("!") : x),
    };
    const i = IN.L(L)(0)(
      F.o((o, L) => o(L.toString, L.toPromise)),
      F.c((c, L) => c(L.error, (x: unknown) => (x === "2" ? 4 : x))),
    );

    const re = [] as unknown[];
    const x = i(async (x) => re.push(await x));
    x.p.p.i(1);
    x.p.p.i(2);

    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    eq(re)([[new Error("!"), ["1"]], "0", 4]);
  },
}));

describe(S, ({ eq }) => ({
  simple: () => {
    const empty = () => "";
    const add = (a: number, b: number) => a + b;
    const i = IN.L([empty, add])(0)(
      F((x) => x * x),
      S((v, s: __<number>, [_, add]) => add(v, s || 0)),
      S(
        ([e]) => e(),
        (v, s) => [s, `${v}`].filter(Boolean).join(";"),
      ),
    );
    const re = [] as unknown[];
    const x = i((x) => re.push(x));
    x.p.p.p.i(1);
    x.p.p.p.i(2);
    eq(re)(["0", "0;1", "0;1;5"]);
  },
  meta: () => {
    const f = (x: unknown) => x;
    const i = IN(1, "1")(F(f)) as any;
    eq(i.__[1]())(f);
    eq(i.__[2].__)(["IN", 1]);
    const x = i((x: 1) => x);
    eq(x.__[1]())(f);
    eq(x.p.__)(["IN", 1]);
  },
}));
