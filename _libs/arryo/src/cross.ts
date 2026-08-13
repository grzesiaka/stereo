import { ARR } from "~types";

export type CrossArray<A extends ARR, B extends ARR> = A extends readonly [infer hA, ...infer rA extends ARR]
  ? B extends readonly [infer hB, ...infer rB extends ARR]
    ? [[hA, hB], ...CrossArray<[hA], rB>, ...CrossArray<rA, [hB]>, ...CrossArray<rA, rB>]
    : B extends readonly []
      ? []
      : [A[number], B[number]][]
  : A extends readonly []
    ? []
    : [A[number], B[number]][];

export type Cross<A, B> = A extends ARR ? (B extends ARR ? CrossArray<A, B> : Cross<A, [B]>) : Cross<[A], B>;

export const cross = <const A, const B>(a: A, b: B): Cross<A, B> => {
  // @ts-expect-error
  switch ((Array.isArray(a) | (Array.isArray(b) << 1)) as 0 | 1 | 2 | 3) {
    case 0:
      return [[a, b]] as never;
    case 1:
      return ((a as ARR).length ? (a as ARR).map((a) => [a, b]) : []) as never;
    case 2:
      return ((b as ARR).length ? (b as ARR).map((b) => [a, b]) : []) as never;
    case 3:
      return (a as ARR).flatMap((a) => (b as ARR).map((b) => [a, b])) as never;
  }
};

export default cross;
