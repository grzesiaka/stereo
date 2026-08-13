import { Add } from "ts-arithmetic";
import { Tagged, GetTagMetadata, GetTagName, UnwrapTaggedArr } from "~types";

export type Sum<N extends readonly number[]> = N extends readonly [
  infer H extends number,
  ...infer R extends readonly number[],
]
  ? Add<H, Sum<R>>
  : N extends []
    ? 0
    : N extends Array<infer X>
      ? X
      : 0;

export type TaggedSum<N extends readonly number[], Tag extends PropertyKey = GetTagName<N[number]>> = N extends
  | readonly []
  | readonly never[]
  ? 0
  : Tagged<Sum<UnwrapTaggedArr<N>>, Tag, GetTagMetadata<N[number], Tag>>;

export const sum = <const Ns extends readonly number[]>(ns: Ns) =>
  ns.reduce((a, n) => a + n, 0) as GetTagName<Ns[number]> extends never ? Sum<Ns> : TaggedSum<Ns>;

export default sum;
