import { Min as Min_ } from "ts-arithmetic";
import { GetTagMetadata, GetTagName, Tagged, UnwrapTaggedArr } from "~types";

export type Min<N extends readonly number[], Default extends number = N[0]> = N extends readonly [
  infer H extends number,
  ...infer R extends number[],
]
  ? Min_<H, Min<R, H>>
  : Default;

export type TaggedMin<
  N extends readonly number[],
  Tag extends PropertyKey = GetTagName<N[number]>,
  Default extends number = UnwrapTaggedArr<N>[0],
> = N extends readonly [] | readonly never[]
  ? Default
  : Tagged<Min<UnwrapTaggedArr<N>, Default>, Tag, GetTagMetadata<N[number], Tag>>;

export const min = <const Ns extends readonly number[], const D extends number = Ns[0] extends never ? number : Ns[0]>(
  n: Ns,
  d = (n.length ? n[0] : Infinity) as D,
) =>
  (n.length === 0 ? d : Math.min(...n)) as GetTagName<Ns[number]> extends never
    ? Min<Ns, D>
    : TaggedMin<Ns, GetTagName<Ns[number]>, D>;

export default min;
