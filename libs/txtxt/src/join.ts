type Txt = string | number;

export type Join<Parts extends readonly Txt[], Separator extends Txt = ""> = Parts["length"] extends 0
  ? ""
  : Parts["length"] extends 1
    ? `${Parts[0]}`
    : Parts extends readonly [infer S extends Txt, ...infer R extends readonly Txt[]]
      ? `${S}${Separator}${Join<R, Separator>}`
      : string;

type J = Join<[1], "">;

export const join =
  <const Separator extends string>(separator = "" as Separator) =>
  <const Parts extends readonly Txt[]>(parts: Parts) =>
    parts.join(separator) as Join<Parts, Separator>;

export default join;
