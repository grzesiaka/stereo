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

/**
 * Start with `fn: (a: A, c: C) => B` you will get a function `(a: A, c: C) => B` back,
 * but when called `B` will be extended by `{ __: [op, [A, C]]}` remembering how `B` was created.
 * `__` is not reflected in type; only in the runtime.
 *
 * @param fn any function
 * @param op id of the operation; defaults to `fn["name"]`
 * @returns `Proxy` to `fn`
 */
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
 * Adds reference under `__` to a `operation-id` (_default_: function's name) and a function's params
 * to values created by calling a function from the provided dictionary.
 *
 * @see {@link asOP}, {@link $asOPs}
 *
 * `Implicit` flat controls if augmentation should be reflect on type level `__`.
 *  Unfortunately, adding anything to a function with generic params breaks type inference in `compose` / `pipe`.
 *
 * @returns A function; more info: {@link asOPs}.
 */
export const $asOPs =
  <Implicit extends boolean>() =>
  <FNs extends Dict<Fn<ARR, object>, string>>(fns: FNs): Implicit extends true ? FNs : WithExplicitOP<FNs> =>
    new Proxy(fns, {
      get: (t: any, key: any) => asOP(Reflect.get(t, key)),
    });

/**
 * In runtime, adds reference under `__` to a `operation-id` (_default_: function's name) and a function's params
 * to values created by calling a function from the provided dictionary.
 *
 * @see {@link asOP}, {@link $asOPs}
 *
 * @param fns A Dictionary with functions. Each function must return object-like value which does not have `__` property.
 * @returns A proxy to this dictionary that automatically tracks how value was created by calling one of the functions.
 */
export const asOPs = $asOPs<true>();
