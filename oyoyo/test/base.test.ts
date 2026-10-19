import { describe } from "~testing";
import { event, flatten, input, once, val } from "../src";

describe(flatten, ({ eq }) => ({
  input: () => {
    const i = flatten(input(1)()((x) => x));
    eq(i[0].__, ["input", 1]);
    eq(i.length, 1);
  },

  event: () => {
    const i = flatten(event<number>()()((x) => x));
    eq(i[0].__, ["event"]);
    eq(i.length, 1);
  },

  val: () => {
    const i = flatten(val(1)()((x) => x));
    eq(i[0].__, ["val", 1]);
    eq(i.length, 1);
  },

  once: () => {
    const i = flatten(once<number>()()((x) => x));
    eq(i[0].__, ["once"]);
    eq(i.length, 1);
  },
}));
