import { a } from "objoy";
import { ARR, Dict, Fn, Fn$I, Fn$O } from "~types";

export interface WithOP<OP_ID extends string, Params> {
  __: OP<OP_ID, Params>;
}

export type OP<OP_ID extends string = string, Params = unknown> = [OP_ID, Params];
/**
 * Tags a result of operation with operation id and operation params
 *
 * @param operation_id id of the operation
 * @param operation_params params of the operation
 * @param x value to be tagged
 * @returns `Object.assign(x, { __: [Params, OP_ID] })`
 */
export const OP =
  <OP_ID extends string>(id: OP_ID) =>
  <const Params>(p: Params) =>
  <X extends {}>(x: X) =>
    a(x, { __: [id, p] as OP<OP_ID, Params> });

export const GET_OP =
  <OP_ID extends string, Params>() =>
  <X extends {}>(x: X) =>
    (x as any).__ as [OP_ID, Params] | undefined;

export const asOP = <F extends Fn<ARR, {}>>(fn: F, op = fn["name"]) =>
  new Proxy(fn, {
    apply(_, thisArgs, args) {
      const r = Reflect.apply(fn, thisArgs, args);
      return OP(op)(args)(r);
    },
  });

export type WithExplicitOP<FNs extends Dict<Fn<ARR, object>, string>> = {
  [K in keyof FNs]: <const P extends Fn$I<FNs[K]>>(...p: P) => Fn$O<FNs[K]> & WithOP<K & string, P>;
};

/**
 *  Allows tracking by calling which function and with which parameters a value was created.
 *
 * `Implicit` flat controls if ops should be reflect on type level `__`.
 *  Unfortunately, adding anything to a function with generic params breaks type inference in `compose` / `pipe`.
 *
 * @returns _take a look at asOPs_
 */
export const $asOPs =
  <Implicit extends boolean>() =>
  <FNs extends Dict<Fn<ARR, object>, string>>(fns: FNs): Implicit extends true ? FNs : WithExplicitOP<FNs> =>
    new Proxy(fns, {
      get: (t: any, key: any) => asOP(Reflect.get(t, key)),
    });

/**
 * Allows tracking by calling which function and with which parameters a value was created.
 *
 * @param fns A Dictionary with functions. Each function must return object-like value which does not have `__` property.
 * @returns A proxy to this dictionary that automatically will track how value was created by calling one of the functions.
 */
export const asOPs = $asOPs<true>();
