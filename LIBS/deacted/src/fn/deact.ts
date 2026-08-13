import { ARR, Fn$I, Fn$O } from "jsyoyo";

export type DeactFn<Tag extends string, Params extends ARR> = <T extends Tag>(
  T: T,
) => <P extends Params>(
  ...ps: P
) => <Kids extends ARR>(...kids: Kids) => Kids extends readonly [] ? [T, P] : [T, P, Kids];

export const deactFn =
  <F extends (T: any) => (...ps: ARR) => any>(_: F): DeactFn<Fn$I<F>[0], Fn$I<Fn$O<F>>> =>
  (t) =>
  (...ps) =>
  (...kids): any =>
    kids.length ? [t, ps, kids] : [t, ps];

// This approach does not offer full enforcing of allowed AST - possible mismatch between OP_ID and PARAMS
// type Fn$IdParams<F extends (T: any) => (...ps: ARR) => any> = [Fn$I<F>[0], Fn$I<Fn$O<F>>];

// const f =
//   <K extends "a" | "b">(k: K) =>
//   (...ps: K extends "a" ? readonly [1 | 0, 2?] : ["www"]) =>
//     2;
// type P = Fn$I<typeof f>[0];
// const d = deactFn(f);
// type R = Fn$O<Fn$O<Fn$O<typeof d>>>;
// type Z = Extract<R, readonly [any, any]>;

// const a = d("a")(0)(d("a")(1)(), d("b")(1, 2)());

// type AB = Fn$IdParams<typeof d>;
