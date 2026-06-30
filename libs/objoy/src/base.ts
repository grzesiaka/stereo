/**
 * An alias for:
 *
 * `Object.assign`
 *
 * @todo Improve the typing of built-in typescript's Object.assign
 */
export const a = Object.assign;

/**
 * An alias for:
 *
 * `Object.entries`
 *
 * It makes the typing more precise, but for wild objects the typing might be incorrect.
 */
export const es = Object.entries as <const X extends object>(obj: X) => { [K in keyof X]: [K, X[K]] }[keyof X][];

/**
 * An alias for:
 *
 * `Object.keys`
 *
 * It makes the typing more precise, but for wild objects the typing might be incorrect.
 */
export const ks = Object.keys as <const X extends object>(obj: X) => (keyof X)[];

/**
 * Return a key / first key of the object
 * @param obj an object
 * @returns a key / first key
 */
export const k1 = <const X extends object>(obj: X): keyof X => {
  for (const k in obj) {
    return k;
  }
  return void 0 as never;
};

export type Entry<X extends {}> = { [K in keyof X]: [K, X[K]] }[keyof X];

/**
 * Upgrades value by merging it with a result of a computation based on that value
 *
 * @param x a value to upgrade
 * @param $ derived properties
 * @returns `Object.assign(x, $(x))`
 */
export const u = <X extends object, Y>(x: X, $: (x: X) => Y) => a(x, $(x));

/** Maps object respecting it structure */
export const mb =
  <O extends {}, X>(f: (...vk: [value: Entry<O>[1], key: Entry<O>[0]]) => X) =>
  (O: O) => {
    const r = {} as { [K in keyof O]: X };
    for (const k in O) {
      r[k] = f(O[k], k);
    }
    return r as { [K in keyof O]: X };
  };
