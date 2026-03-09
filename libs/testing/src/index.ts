import * as v from "vitest";

type EQ = (<const A>(a: A) => (b: NoInfer<A>) => A) & (<const A>(a: A, b: NoInfer<A>) => A);

const eq: EQ = (...a: [any] | [any, any]) => (a.length === 2 ? eq(a[0])(a[1]) : (b) => (v.expect(a[0]).toEqual(b), b));

const res = <X>() => {
  const r = [] as X[];
  return {
    items: r,
    add: (x: X) => r.push(x),
    eq: eq(r),
    last: (n?: number, t?: (x: X) => unknown) => {
      n !== void 0 && eq(r.length, n);
      const l = r[r.length - 1] as X;
      return eq(t ? t(l) : l);
    },
    len: (n: number) => eq(r.length, n),
  };
};

const ctx = {
  /**
   * `import * as v from "vitest"`
   */
  v,
  /**
   * Equality comparison that checks both for values and for types.
   *
   * ```
   * type EQ = (<const A>(a: A) => (b: NoInfer<A>) => A) & (<const A>(a: A, b: NoInfer<A>) => A);
   *
   * const eq: EQ = (...a: [any] | [any, any]) => (a.length === 2 ? eq(a[0])(a[1]) : (b) => (v.expect(a[0]).toEqual(b), b));
   * ```
   */
  eq,

  /**
   * Creates an array of given type, and some test helpers
   */
  res,
};

type Ctx = typeof ctx;

type TestFn<R = unknown> = (ctx: Ctx, vitest: typeof v) => R;

/** A wrapper for vitest.test that auto-injects context with vitest export */
export const test = <R = any>(n: string, fn: TestFn<R>) => v.test(n, () => fn(ctx, v));

/**
 * 
 * A wrapper for `vitest.describe` to defining tests just a little bit faster
 * 
 * @param nameOrFn name of the test or function to be tested (name of the function becomes the name of the test )
 * @param tests an object with tests; `_`s are replaced ` `; if starts with `ONLY` runs as `vitest.test.only`
 * @param name allows override of the `nameOfFn`; if starts with `ONLY` runs as `vitest.describe.only`
 * @returns void 0
 *  
 * ---- 
 * 
 * @self
 * ```
 * export const describe = (
    nameOrFn: string | Function,
    tests: (ctx: Ctx, vitest: typeof v) => Record<string, () => void>,
    name = typeof nameOrFn === "string" ? nameOrFn : nameOrFn.name,
  ) =>
  (name.startsWith("ONLY") ? v.describe.only : v.describe)(name, () => {
    const ts = tests(ctx, v);
    for (const k in ts) {
      (k.startsWith("ONLY") ? v.test.only : v.test)(k.replace(/_/g, " "), ts[k]);
    }
  });
 * ```
 */
export const describe = (
  nameOrFn: string | Function,
  tests: (ctx: Ctx, vitest: typeof v) => Record<string, () => void>,
  name: "ONLY" | (string & {}) = typeof nameOrFn === "string" ? nameOrFn : nameOrFn.name,
) =>
  (name.startsWith("ONLY") ? v.describe.only : v.describe)(name, () => {
    const ts = tests(ctx, v);
    for (const k in ts) {
      (k.startsWith("ONLY") ? v.test.only : v.test)(k.replace(/_/g, " "), ts[k]);
    }
  });

export default describe;
