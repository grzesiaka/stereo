import { describe } from "~testing";

import { ERRs } from "../src";

describe(ERRs, ({ eq }) => ({
  empty: () => {
    const e = ERRs(() => ({}));
    eq(e, {});
  },

  nested: () => {
    const es = ERRs(($) => ({
      http: {
        404: $<[url: string]>(),
        500: "", // same as `500: $`
      },
      ws: {
        lost: "connection_lost",
      },
    }));

    eq(Object.keys(es.http), ["404", "500"]);
    const lost = es.ws.lost();
    const notFound = new es.http[404].$("abc.com");
    const down = es.http[500]();

    eq(es.ws.lost.is(lost), true);
    eq(es.http[404].is(lost), false);

    eq(es.ws.lost.is(notFound), false);
    eq(es.http[404].is(notFound), true);

    eq(es.ws.lost.is(down), false);
    eq(es.http[404].is(down), false);
  },
}));
