import { describe } from "~testing";
import { __ } from "jsyoyo";

import disposyo from "../src/index";

describe(disposyo, ({ eq, res }) => ({
  empty: () => {
    const d = disposyo({});
    eq(d.__, ["0", {}]);
    d();
  },

  single_fn: () => {
    const r = res();
    const add = () => r.add(0);
    const d = disposyo(add);
    eq(d.__, ["0", add]);
    d();
    r.eq([0]);
  },

  arr_of_fn: () => {
    const r = res();
    const add0 = () => r.add(0);
    const add1 = () => r.add(1);
    const d = disposyo([add0, add1]);
    eq(d.__, ["0", [add0, add1]]);
    d();
    r.eq([0, 1]);
  },

  tree_of_fn_or_arr: () => {
    const r = res();
    const add0 = () => r.add(0);
    const add1 = () => r.add(1);
    const t = {
      fn: () => r.add("fn"),
      arr: [add0, add1],
      deep: {
        fn: () => r.add("fn/deep"),
        arr: [add0, add1],
      },
    };

    const d = disposyo(t);
    eq(d.__, ["0", t]);
    d();
    r.eq(["fn", 0, 1, "fn/deep", 0, 1]);
  },
}));
