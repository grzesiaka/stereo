import { describe as dt } from "~testing";

import V from "./var";
import { __ } from "~js";

dt("Var / default context", ({ eq }) => ({
  unknown: () => {
    const x = V();
    const r = [] as unknown[];
    const cb = (x: unknown) => r.push(x);
    const o = x.OO(cb);

    eq(x.OOs.size, 1);
    eq(x.v, void 0);
    eq(o.x, cb);
    eq(o.v, void 0);
    eq(r, []);

    x(1);
    eq(o.v, 1);
    eq(x.v, 1);
    eq(r, [1]);

    o.d();
    eq(x.OOs.size, 0);
    x(2);
    eq(o.v, 2); // edge-case o.v has newest version after disposed
    eq(x.v, 2);
    eq(r, [1]);
  },

  num: () => {
    const x = V.N("num");
    eq(x.id, "num");

    const r = [] as number[];
    const cb = (x: number) => r.push(x);
    const o = x.OO(cb);

    eq(x.OOs.size, 1);
    x.OO(cb); // no effect as already registered
    eq(x.OOs.size, 1);

    eq(x.v, void 0);
    eq(o.x, cb);
    eq(o.v, void 0);
    eq(r, []);

    x(1);
    eq(o.v, 1);
    eq(x.v, 1);
    eq(r, [1]);

    o.d();
    eq(x.OOs.size, 0);

    x(2);
    eq(o.v, 2); // edge-case o.v has newest version after disposed
    eq(x.v, 2);
    eq(r, [1]);

    // @ts-expect-error must be a number so `undefined` is filtered out
    x(void 0);
  },

  str: () => {
    const x = V.S("str", "d");
    eq(x.id, "str");
    eq(x.defV, "d");

    const r = [] as string[];
    const cb = (x: string) => r.push(x);
    const o = x.OO(cb);
    const o1 = x.OO((x: string) => r.push(x));

    eq(x.OOs.size, 2);
    eq(x.v, "d");
    // eq(x.v, void 0); an error as default value provided
    eq(o.x, cb);
    // eq(o.v, void 0);  an error as default value provided
    eq(o.v, eq(o1.v, "d"));
    eq(r, []);

    x("1");
    eq(o.v, "1");
    eq(o1.v, "1");
    eq(x.v, "1");
    eq(r, ["1", "1"]);

    o.d();
    eq(x.OOs.size, 1);

    x("2");
    eq(o.v, "2"); // edge-case o.v has newest version after disposed
    eq(o1.v, "2");
    eq(x.v, "2");
    eq(r, ["1", "1", "2"]);

    // @ts-expect-error must be a number so `undefined` is filtered out
    x(void 0);
  },

  bool: () => {
    const x = V.B({ id: "boo", v: true });
    eq(x.id, "boo");
    // @ts-expect-error .defV can be added when constructing
    eq(x.defV, void 0);
    eq(x.v, true);

    const r = [] as boolean[];
    const cb = (x: boolean) => r.push(x);
    const o = x.OO(cb);
    const o1 = x.OO((x: boolean) => r.push(x));

    eq(x.OOs.size, 2);
    eq(x.v, true);
    // eq(x.v, void 0); // an error as default value provided
    eq(o.x, cb);
    // eq(o.v, void 0);  an error as default value provided
    eq(o.v, eq(o1.v, true));
    eq(r, []);

    x(false);
    eq(o.v, false);
    eq(o1.v, false);
    eq(x.v, false);
    eq(r, [false, false]);

    o.d();
    eq(x.OOs.size, 1);

    x(true);
    eq(o.v, true); // edge-case o.v has newest version after disposed
    eq(o1.v, true);
    eq(x.v, true);
    eq(r, [false, false, true]);

    // @ts-expect-error must be a number so `undefined` is filtered out
    x(void 0);
  },
}));

dt("Var / custom context", ({ eq }) => ({
  no_extra: () => {
    const x = V.$<[string, number], { "!": "!" }>()({
      defV: ["abc", 1],
      "!": "!",
    });
  },

  with_extra: () => {
    const E = ["abra", "kadabra"] as const;
    const x = V.$<typeof V, { "!": "abra kadabra" }, typeof E>(...E)((a, b) => ({
      defV: V,
      "!": `${a} ${b}`,
    }));
  },
}));
