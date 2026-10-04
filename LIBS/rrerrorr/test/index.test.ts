import { describe } from "~testing";

import { ERRs } from "../src";
import { __ } from "jsyoyo";

describe(ERRs, ({ eq }) => ({
  empty: () => {
    const e = ERRs(() => ({}));
    eq(e, {});
  },

  small: () => {
    const es = ERRs(($) => ({
      http: {
        404: { not_found: $<string>() },
        500: "server_down",
      },
      ws: {
        lost: $,
      },
    }));

    eq(Object.keys(es.http), ["404", "500"]);
    const lost = es.ws.lost();
    const notFound = new es.http[404].not_found.$("abc.com");
    const down = es.http[500]();

    eq(lost.name, "ws.lost");
    eq(lost.ctx, __);
    eq(es.ws.lost.is(lost), true);
    eq(es.http[404].not_found.is(lost), false);

    eq(notFound.name, "http.404.not_found");
    eq(notFound.ctx, "abc.com");
    eq(es.ws.lost.is(notFound), false);
    eq(es.http[404].not_found.is(notFound), true);

    eq(down.name, "http.500.server_down");
    eq(down.ctx, __);
    eq(es.ws.lost.is(down), false);
    eq(es.http[404].not_found.is(down), false);
  },
}));
