import { Multiply } from "ts-arithmetic";
import { Tagged, GetTagMetadata, GetTagName, UnwrapTaggedArr } from "~types";

export type Product<N extends readonly number[]> = N extends readonly [
  infer H extends number,
  ...infer R extends readonly number[],
]
  ? Multiply<H, Product<R>>
  : N extends []
    ? 1
    : N extends Array<infer X>
      ? X
      : 1;

export type TaggedProduct<N extends readonly number[], Tag extends PropertyKey = GetTagName<N[number]>> = N extends
  | readonly []
  | readonly never[]
  ? 0
  : Tagged<Product<UnwrapTaggedArr<N>>, Tag, GetTagMetadata<N[number], Tag>>;

export const product = <const Ns extends readonly number[]>(ns: Ns) =>
  ns.reduce((a, n) => a * n, 1) as GetTagName<Ns[number]> extends never ? Product<Ns> : TaggedProduct<Ns>;

export default product;
