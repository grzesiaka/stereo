import { SimplifyDeep, UnionToIntersection } from "type-fest";
import { type TypierBase as IOSpec, type StaticArr, N } from "typier";
import { __, ARR } from "~types";

const a = () => [import("typier")];

const IMPORT = <K extends string>(k: K) => import(k);
const i = IMPORT("typier");

type IOSpecs = ARR<IOSpec>;

const t = <S extends IOSpecs>(...specs: S) => [specs, void 0] as [S, __<StaticArr<S>>];

const [x] = t(N()("NUM"));
x[0].$KEY;

type OBJ = ["A", "B", ["AB"]] | ["A", "A", ["AA"]] | ["B", "A", ["BA"]] | ["B", "B", ["BB"]] | ["C"];
type _ToTree<O extends ARR> = UnionToIntersection<
  O extends [infer T0 extends string, ...infer R] ? { [K in T0]: ToTree<R> } : O[0]
>;

type ToTree<O extends ARR> = SimplifyDeep<_ToTree<O>>;

type T = ToTree<OBJ>;

const SS =
  <Ps extends ARR<string>>(...ps: Ps) =>
  <R>($: (...ps: Ps) => R) =>
    $(...ps);

const s = SS("A", "B")((a, b) => `[${a}][${b}]` as const);
