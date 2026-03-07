// import { $$, __, a, Cb } from "~js";

// type OBS<X = unknown, ID extends __<string> = __<string>> = (__ extends ID ? {} : { id: ID }) & {
//   v: X;
//   x: Cb<X>;
//   d: () => void;
// };

// interface VAR0<X = any, ID extends __<string> = __<string>> {
//   id: ID;
//   (x: $$<X>): void;
//   x: X;
//   /**
//    * Observe changes
//    * @param cb function that will be called upon change
//    */
//   oo(cb: Cb<X>): OBS<X, ID>;

//   /**
//    * Observers
//    */
//   obs: Set<OBS<X, ID>>;
// }

// interface VAR<cX = any, ID extends __<string> = __<string>, InitX extends cX = cX> extends VAR0<cX, ID> {
//   initX: InitX;
// }

// const obs =
//   <X>(obs: Set<Cb<X>>, onChanged?: () => void) =>
//   (cb: Cb<X>): OBS<X, ID> => {
//     const
//   }

// export const minObserver =
//   (m: number) =>
//   <Var extends VAR0>($: Var) => {
//     const tmp = new Set<Cb>();
//     $.oo = obs(tmp, () => {
//       if (tmp.size >= m) {
//         $.obs = tmp;
//         "x" in $ && $($.x);
//       }
//     });
//   };

// type UndefinedOptional<X> = X extends readonly [infer H, ...infer R]
//   ? __ extends H
//     ? [H?, ...UndefinedOptional<R>]
//     : [H, ...UndefinedOptional<R>]
//   : [];

// type VarParams<X, InitX extends X, ID extends __<string>, E> = UndefinedOptional<
//   [value: InitX, id: ID, onCreated: __<($: __ extends X ? VAR0<X, ID> : VAR<X, ID, InitX>) => E>]
// >;

// const $Var =
//   <cX = unknown, cID extends __<string> = __<string>>(onValue?: (x: cX, $: VAR<cX, cID>) => void) =>
//   <const X extends cX, const ID extends cID, E = {}>(...[ix, ID, onCreated]: VarParams<cX, X, ID, E>) => {
//     const $ = (
//       onValue ? (x: cX) => onValue(x, $ as any) : (x: $$<X>) => (($.x = x), $.obs.forEach((c) => c(x)))
//     ) as __ extends X ? VAR0<cX, ID> : VAR<cX, ID, X>;
//     $.x = ix as X;
//     $.obs = new Set();
//     $.oo = obs($.obs);
//     if (ix !== void 0) {
//       ($ as VAR<cX>).initX = $.x = ix;
//     }
//     return (onCreated ? a($, (onCreated as any)($)) : $) as E & (__ extends X ? VAR0<cX, ID> : VAR<cX, ID, X>);
//   };

// export const Var = $Var() as ReturnType<typeof $Var> & { $: typeof $Var };
// Var.$ = $Var;

// export default Var;
