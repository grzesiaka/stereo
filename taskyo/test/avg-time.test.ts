import { describe } from "~testing";

import { choice, parallel, sequence, spec } from "../src/index";
import type { MsOrNumber } from "jsyoyo";

import d from "jsyoyo/_";
import { maxAvgTime, sumAvgTime } from "../src/avg-time";

const s = <N extends MsOrNumber>(n: N) => spec.$()(d)((_, d) => d.wait(n))(`${n}ms`, { avgTime: n });

describe("avg-time", ({ eq }) => ({
  ops: () => {
    const specs = [s(1), s(2)] as const;
    const sum = sumAvgTime(specs);
    const max = maxAvgTime(specs);
    eq(sum, 3);
    eq(max, 2);
  },

  avg_time: () => {
    const c = choice([s(10), s(20)])("20");
    eq(c.avgTime, 20);
    const p = parallel([s(40), s(100)])("100");
    eq(p.avgTime, 100);
    const q = sequence(c).S(p).S(c).S(p);
    const qs = q.asSpec("240");
    eq(qs.avgTime, 240); // TODO recovery
  },
}));
