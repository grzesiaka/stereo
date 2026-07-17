import { describe } from "~testing";
import { pipe } from "composyo";
import { dethunk, mapByTag, TREExprs } from "../src";

const map0 = mapByTag({});
const expr0 = pipe([] as []);
const mABC = {
  A: (_: "A") => "a" as const,
  B: (b: string | number) => [b, b] as const,
  C: () => "c" as const,
} as const;
const mapABC = mapByTag(mABC);
type TagParamABC = ["A", "A"] | ["B", string | number] | ["C", undefined];
const exprABC = pipe(["A", "A", [["C", undefined, [() => ["C", undefined]]]]] as const satisfies TREExprs<
  TagParamABC,
  () => TagParamABC
>);
const exprABC_ = ["A", "A", [["C", undefined, [["C", undefined]]]]] as [
  "A",
  "A",
  [["C", undefined, [["C", undefined]]]],
] satisfies TREExprs<TagParamABC>;

describe(mapByTag, ({ eq }) => ({
  empty: () => {
    eq([])(expr0(map0()));
    eq([])(expr0(mapABC()));
  },

  dethunk: () => {
    const de = exprABC(dethunk);
    eq(exprABC_)(de);
    eq(de)(exprABC_);
  },

  abc_map0: () => {
    const abc0 = exprABC(dethunk, map0());
    const abc0_ = pipe(exprABC_)(map0());
    eq(abc0, abc0_);
    eq(abc0, exprABC_);
  },

  abc: () => {
    const abc = exprABC(dethunk, mapABC());
    const abc_ = pipe(exprABC_)(mapABC());
    eq(abc, abc_);
    eq(abc, ["a", [["c", ["c"]]]]);
  },
}));
