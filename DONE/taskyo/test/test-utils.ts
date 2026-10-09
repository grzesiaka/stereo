import { __, a, tick } from "jsyoyo";
import { Spec, spec } from "../src";
import { Tree } from "treeo";
import { indexify } from "proyij";

export const IO = <ID extends string, Ticks extends number = 2>(I: ID, T = 2 as Ticks) =>
  spec(__, { curr: 0, total: T })<ID, Promise<number>>(async (p, _d, u) => {
    for (let i = 0; i < T; i++) {
      await tick(2);
      i && u({ curr: i }); // zero is the start value any way, so no point to report it twice
    }
    u({ curr: T });
    return p.length;
  })(I);

export const specs = () => [IO("A", 1), IO("B", 2), IO("C", 4)] as const;
export const specObj = <E extends Tree<Spec> = {}>(e = {} as E) => a(indexify("Id")(specs()), e);
