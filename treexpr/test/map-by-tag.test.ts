import { describe } from "~testing";
import { pipe } from "composyo";
import { dethunk, mapByTag, TREExprs } from "../src";

const map0 = mapByTag({});
const expr0 = pipe([] as []);
const mABC = {
  A: (_: "A") => "a" as const,
  B: <X extends string | number>(b: X) => [b, b] as const,
  C: () => "c" as const,
} as const;
const map = mapByTag(mABC);
type TagParamABC = ["A", "A"] | ["B", string | number] | ["C", undefined];

type Expr<E = () => TagParamABC> = TREExprs<TagParamABC, E>;
const exp = <const E extends Expr>(e: E) => pipe(e);
const A_CC = exp(["A", "A", [["C", undefined, [() => ["C", undefined]]]]]);
const A_CC_ = ["A", "A", [["C", undefined, [["C", undefined]]]]] as [
  "A",
  "A",
  [["C", undefined, [["C", undefined]]]],
] satisfies TREExprs<TagParamABC>;

describe(mapByTag, ({ eq }) => ({
  empty: () => {
    eq([])(expr0(map0()));
    eq([])(expr0(map()));
  },

  dethunk: () => {
    const de = A_CC(dethunk);
    eq(A_CC_)(de);
    eq(de)(A_CC_);
  },

  abc_map0: () => {
    const abc0 = A_CC(dethunk, map0());
    const abc0_ = pipe(A_CC_)(map0());
    eq(abc0, abc0_);
    eq(abc0, A_CC_);
  },

  abc: () => {
    const abc = A_CC(dethunk, map());
    const abc_ = pipe(A_CC_)(map());
    eq(abc, abc_);
    eq(abc, ["a", [["c", ["c"]]]]);
  },

  // extra_params: () => {
  //   const e = exp(["B", 0, [["B", 1]]]);
  //   const m = e(mapByTag({ B: (...x) => x })());
  //   console.log(m);
  //   console.log(m[0]);
  //   console.log(m[0][3]);
  //   console.log(m[0][3][0][2][0]);
  // },
}));
