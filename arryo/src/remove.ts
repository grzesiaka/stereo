export type Remove<A extends readonly any[], E> = A extends readonly []
  ? []
  : A extends readonly [infer Head, ...infer Tail]
    ? Head extends E
      ? Remove<Tail, E>
      : [Head, ...Remove<Tail, E>]
    : Array<Exclude<A[number], E>>;

const remove =
  <const E, const S = E>(E: E[], S = new Set<S>(E as never as S[])) =>
  <const A extends readonly any[]>(A: A) =>
    A.filter((item) => !S.has(item)) as Remove<A, S>;

export default remove;
