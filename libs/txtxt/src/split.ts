export type Chars<S extends string> = S extends `${infer C}${infer Rest}` ? [C, ...Chars<Rest>] : [];

export type Split<S extends string, Separator extends string> = string extends S
  ? string[]
  : string extends Separator
    ? string[]
    : Separator extends ""
      ? Chars<S>
      : S extends `${infer Head}${Separator}${infer Tail}`
        ? [Head, ...Split<Tail, Separator>]
        : [S];

export const split =
  <const Separator extends string = " ">(separator = " " as Separator) =>
  <const Txt extends string>(txt: Txt) =>
    txt.split(separator) as Split<Txt, Separator>;

export default split;
