import { describe as dt } from "~testing";

import V from "../src/var";
import { __ } from "~js";

dt("Var / default context", ({ eq, res }) => ({
  unknown: () => {
    const x = V();
    const r = [] as unknown[];
    const cb = (x: unknown) => r.push(x);
    const o = x.OO(cb);

    eq(x.OOs.size, 1);
    eq(x.V, void 0);
    eq(o.x, cb);
    eq(o.v, void 0);
    eq(r, []);

    x(1);
    eq(o.v, 1);
    eq(x.V, 1);
    eq(r, [1]);

    o.d();
    eq(x.OOs.size, 0);
    x(2);
    eq(o.v, 2); // edge-case o.v has newest version after disposed
    eq(x.V, 2);
    eq(r, [1]);
  },

  num_via_id_no_initial_value: () => {
    const x = V.N("num");
    eq(x.Id, "num");

    const r = [] as (number | undefined)[];
    const cb = (x?: number) => r.push(x);
    const o = x.OO(cb);

    eq(x.OOs.size, 1);
    x.OO(cb); // no effect as already registered
    eq(x.OOs.size, 1);

    eq(x.V, void 0);
    eq(o.x, cb);
    eq(o.v, void 0);
    eq(r, []);

    x(1);
    eq(o.v, 1);
    eq(x.V, 1);
    eq(r, [1]);

    o.d();
    eq(x.OOs.size, 0);

    x(2);
    eq(o.v, 2); // edge-case o.v has newest version after disposed
    eq(x.V, 2);
    eq(r, [1]);

    x(void 0);
  },

  str_via_id_with_DefV: () => {
    const x = V.S("str", "d");
    eq(x.Id, "str");
    eq(x.DefV, "d");

    const r = [] as string[];
    const cb = (x: string) => r.push(x);
    const o = x.OO(cb);
    const o1 = x.OO((x: string) => r.push(x));

    eq(x.OOs.size, 2);
    eq(x.V, "d");
    // eq(x.V, void 0); an error as default value provided
    eq(o.x, cb);
    // eq(o.v, void 0);  an error as default value provided
    eq(o.v, eq(o1.v, "d"));
    eq(r, []);

    x("1");
    eq(o.v, "1");
    eq(o1.v, "1");
    eq(x.V, "1");
    eq(r, ["1", "1"]);

    o.d();
    eq(x.OOs.size, 1);

    x("2");
    eq(o.v, "2"); // edge-case o.v has newest version after disposed
    eq(o1.v, "2");
    eq(x.V, "2");
    eq(r, ["1", "1", "2"]);

    // @ts-expect-error must be a number so `undefined` is filtered out
    x(void 0);
  },

  bool_via_objet_with_V: () => {
    const x = V.B({ Id: "boo", V: true });
    eq(x.Id, "boo");
    // @ts-expect-error .defV can be added when constructing
    eq(x.DefV, void 0);
    eq(x.V, true);

    const r = res();
    const o = x.OO(r.add);
    // a separate callback
    const o1 = x.OO((x: boolean) => r.add(x));

    eq(x.OOs.size, 2);
    eq(x.V, true);
    // eq(x.V, void 0); // an error as default value provided
    eq(o.x, r.add);
    // eq(o.v, void 0);  an error as default value provided
    eq(o.v, eq(o1.v, true));
    r.eq([]);

    x(false);
    eq(o.v, false);
    eq(o1.v, false);
    eq(x.V, false);
    r.eq([false, false]);

    o.d();
    eq(x.OOs.size, 1);

    x(true);
    eq(o.v, true); // edge-case o.v has newest version after disposed
    eq(o1.v, true);
    eq(x.V, true);
    r.eq([false, false, true]);

    // @ts-expect-error only boolean accepted
    x(void 0);
  },
}));

dt("Var / custom context", ({ eq, res }) => ({
  no_extra: () => {
    const x = V.$<[string, number], { "!": "!" }>()({
      $(x) {
        return x;
      },
      DefV: ["abc", 1],
      "!": "!",
    });
    eq(x["!"], "!");
    eq(x.V, ["abc", 1]);

    const r = res();
    r.eq([]);

    // since a custom function updates must be handled manually
    x(["", 0]);
    r.eq([]);
  },

  with_extra: () => {
    const E = ["abra", "kadabra"] as const;
    const x = V.$<typeof V, { "!": "abra kadabra"; Id: string }, typeof E>(...E)((a, b) => ({
      Id: "id",
      DefV: V,
      "!": `${a} ${b}`,
    }));

    eq(x.Id)("id");
    eq(x["!"], "abra kadabra");
    eq(x.V, V);
  },

  custom_function: () => {
    const E = ["abra", "kadabra"] as const;
    const x = V.$<number, { "!": "abra kadabra"; Id: string }, typeof E>(...E)((a, b) => ({
      Id: "id",
      DefV: 0,
      CallCount: 0 as number,
      $(v, _, $$) {
        const $ = $$(this);
        $.CallCount++;
        $.V = v;
        $.OOs.forEach((c) => c(v));
        return v;
      },
      "!": `${a} ${b}`,
    }));

    const re = [] as unknown[];
    x.OO((x) => re.push(x));

    eq(x.Id)("id");
    eq(x["!"], "abra kadabra");
    eq(x.V, 0);
    eq(x.DefV, 0);
    eq(x.CallCount, 0);

    x(7);
    eq(x.Id)("id");
    eq(x["!"], "abra kadabra");
    eq(x.V, 7);
    eq(x.DefV, 0);
    eq(x.CallCount, 1);

    x(1);
    eq(x.Id)("id");
    eq(x["!"], "abra kadabra");
    eq(x.V, 1);
    eq(x.DefV, 0);
    eq(x.CallCount, 2);
  },

  custom_function_with_different_input: () => {
    const E = ["abra", "kadabra"] as const;
    const x = V.$<number, { "!": "abra kadabra"; Id: string }, typeof E, string>(...E)((a, b) => ({
      Id: "id",
      DefV: 0,
      CallCount: 0 as number,
      $(x, _, $$) {
        const $ = $$(this);
        $.CallCount++;
        const v = parseInt(x);
        $.V = v;
        $.OOs.forEach((c) => c(v));
        return v;
      },
      "!": `${a} ${b}`,
    }));

    const re = [] as unknown[];
    x.OO((x) => re.push(x));

    eq(x.Id)("id");
    eq(x["!"], "abra kadabra");
    eq(x.V, 0);
    eq(x.DefV, 0);
    eq(x.CallCount, 0);

    x("7");
    eq(x.Id)("id");
    eq(x["!"], "abra kadabra");
    eq(x.V, 7);
    eq(x.DefV, 0);
    eq(x.CallCount, 1);

    x("1");
    eq(x.Id)("id");
    eq(x["!"], "abra kadabra");
    eq(x.V, 1);
    eq(x.DefV, 0);
    eq(x.CallCount, 2);
  },
}));
