import { Negate } from "ts-arithmetic";
import { UnwrapTagged } from "type-fest";
import { GetTagMetadata, GetTagName, Tagged } from "~types";
import { sum } from "./sum";

export type TaggedNegate<N extends Tagged<number>> = Tagged<
  Negate<UnwrapTagged<N> & number>,
  GetTagName<N>,
  GetTagMetadata<N, GetTagName<N>>
>;

export type Subtract<A extends number, B extends number> = ReturnType<
  typeof sum<[A, B extends Tagged<number> ? TaggedNegate<B> : Negate<B>]>
>;

export const subtract = <A extends number, B extends number>(a: A, b: B) => (a - b) as any as Subtract<A, B>;

export default subtract;
