import { Cross, cross } from "./cross";

export type CrossArr<As> = As extends readonly [readonly [infer A, infer B], ...infer R]
  ? [...Cross<A, B>, ...CrossArr<R>]
  : [];

export type CrossArrFn<C extends readonly [unknown, unknown] = readonly [unknown, unknown]> = <
  ArrayOfTuples extends ReadonlyArray<C>,
>(
  arrayOfTuple: ArrayOfTuples,
) => CrossArr<ArrayOfTuples>;

export const crossArr: CrossArrFn = (x) => x.flatMap((a) => cross(a[0], a[1])) as never;

export default crossArr;
