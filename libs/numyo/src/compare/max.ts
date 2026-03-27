import { Max as Max_ } from "ts-arithmetic";
import { GetTagMetadata, GetTagName, Tagged, UnwrapTaggedArr } from "~types";

export type Max<N extends readonly number[], Default extends number = N[0]> = N extends readonly [
  infer H extends number,
  ...infer R extends number[],
]
  ? Max_<H, Max<R, H>>
  : Default;

export type TaggedMax<
  N extends readonly number[],
  Tag extends PropertyKey = GetTagName<N[number]>,
  Default extends number = UnwrapTaggedArr<N>[0],
> = N extends readonly [] | readonly never[]
  ? Default
  : Tagged<Max<UnwrapTaggedArr<N>, Default>, Tag, GetTagMetadata<N[number], Tag>>;

export const max = <const Ns extends readonly number[], const D extends number = Ns[0] extends never ? number : Ns[0]>(
  n: Ns,
  d = (n.length ? n[0] : Infinity) as D,
) =>
  (n.length === 0 ? d : Math.max(...n)) as GetTagName<Ns[number]> extends never
    ? Max<Ns, D>
    : TaggedMax<Ns, GetTagName<Ns[number]>, D>;

export default max;
