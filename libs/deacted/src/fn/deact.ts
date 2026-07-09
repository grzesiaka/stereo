import { ARR } from "jsyoyo";

export type DeactFn<Tag extends string, Params extends ARR> = <T extends Tag>(
  T: T,
) => <P extends Params>(
  ...ps: P
) => <Kids extends ARR>(...kids: Kids) => Kids extends readonly [] ? [T, P] : [T, P, Kids];

export const deactFn =
  <Tag extends string, Params extends ARR>(_?: (t: Tag) => (...p: Params) => unknown): DeactFn<Tag, Params> =>
  (t) =>
  (...ps) =>
  (...kids): any =>
    kids.length ? [t, ps, kids] : [t, ps];
