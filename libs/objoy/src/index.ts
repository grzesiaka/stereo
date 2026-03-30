/**
 * An alias for:
 *
 * `Object.assign`
 *
 * @todo Improve the typing of built-in typescript's Object.assign
 */
export const a = Object.assign;

/**
 * Upgrades value by merging it with a result of a computation based on that value
 *
 * @param x a value to upgrade
 * @param $ derived properties
 * @returns `Object.assign(x, $(x))`
 */
export const u = <X extends object, Y>(x: X, $: (x: X) => Y) => a(x, $(x));

export type Entry<T> = [keyof T, T[keyof T]];

/** Maps object respecting it structure */
export const mb =
  <O extends {}, X>(f: (v: Entry<O>[1], k: Entry<O>[0]) => X) =>
  (O: O) => {
    const r = {} as { [K in keyof O]: X };
    for (const k in O) {
      r[k] = f(O[k], k);
    }
    return r as { [K in keyof O]: X };
  };
