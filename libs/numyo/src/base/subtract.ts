import { Negate } from "ts-arithmetic";
import { UnwrapTagged } from "type-fest";
import { GetTagMetadata, GetTagName, Tagged } from "~types";
import { sum } from "./sum";

export type TaggedNegate<N extends Tagged<number>> = Tagged<
  Negate<UnwrapTagged<N> & number>,
  GetTagName<N>,
  GetTagMetadata<N, GetTagName<N>>
>;

export const subtract = <A extends number, B extends number>(a: A, b: B) =>
  (a - b) as any as ReturnType<typeof sum<[A, B extends Tagged<number> ? TaggedNegate<B> : Negate<B>]>>;

export default subtract;
