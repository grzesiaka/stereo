import { ARR, Fn$I, Fn$O } from "jsyoyo";

export type ActedFn<Tag extends string, Params extends ARR, Out> = <T extends Tag>(
  T: T,
) => <P extends Params>(
  ...ps: P
) => <Kids extends ARR>(...kids: Kids) => Kids extends readonly [] ? [T, Out] : [T, Out, Kids];

export const actedFn =
  <F extends (T: any) => (...ps: ARR) => any>(f: F): ActedFn<Fn$I<F>[0], Fn$I<Fn$O<F>>, Fn$O<Fn$O<F>>> =>
  (t) =>
  (...ps) =>
  (...kids): any =>
    kids.length ? [t, f(t)(...ps), kids] : [t, f(t)(...ps)];
