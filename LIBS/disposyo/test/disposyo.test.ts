import { describe } from "~testing";
import { __ } from "jsyoyo";

import disposyo, { DISPOSE } from "../src/disposyo";

describe(disposyo, ({ eq, res }) => ({
  empty: () => {
    const d = disposyo([]);
    eq(d.__, []);
    d();
  },

  single_fn: () => {
    const r = res();
    const add = () => r.add(0);
    const d = disposyo([add]);
    eq(d.__, [add]);
    d();
    r.eq([0]);
  },

  arr_of_fn: () => {
    const r = res();
    const add0 = () => r.add(0);
    const add1 = () => r.add(1);
    const d = disposyo([add0, add1]);
    eq(d.__, [add0, add1]);
    d();
    r.eq([0, 1]);
  },

  arr_of_fn_added: () => {
    const r = res();
    const add0 = () => r.add(0);
    const add1 = () => r.add(1);
    const d = disposyo([add0, add1]);

    d(
      () => r.add(2),
      () => r.add("!"),
    );

    d();
    r.eq([0, 1, 2, "!"]);
  },

  with_target: () => {
    let done = false;
    const t = disposyo([() => (done = true)], {});
    eq(!!t[DISPOSE], true);
    eq(done, false);
    t[DISPOSE]();
    // @ts-expect-error weirdly TS treats done as `false`
    eq(done, true);
  },
}));
