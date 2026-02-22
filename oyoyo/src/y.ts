import { UnknownRecord } from "type-fest";
import { __, a, u } from "./0";

/**
 * Callback
 */
type Cb<X> = (x: X) => void;

/**
 * Done / Dispose / Clean-up
 *
 * `undefined` - nothing to dispose
 * `0` - already disposed
 */
type Done = __ | 0 | ((fromPrev?: boolean) => void);

/**
 *  Reactive Cell / Observee
 */
type yBlock<X = unknown, L extends UnknownRecord = UnknownRecord, D extends Done = Done> = L & {
  /**
   * Value that changes overtime
   *
   * Called when yBlock propagates information
   */
  x: Cb<X>;

  /**
   * Previous step in a chain
   *
   * `undefined` for initial yBlock
   */
  p?: yBlock;

  /**
   * Next step in a chain;
   *
   * `undefined` for final yBlock
   */
  n?: yBlock;

  /**
   * Done / Dispose
   *
   * if `undefined` nothing to dispose (no computation running)
   *
   * if `prev: falsy` must stop immediately - called from observer
   * if `prev: true` must stop once no more tasks to be performed; called from observee
   *
   */
  d?: D;
};

type y<X = unknown, L extends UnknownRecord = UnknownRecord> = (c: Cb<X>) => yBlock<X, L>;
type y$X<RC> = RC extends y<infer X, any> ? X : never;
type y$L<RC> = RC extends y<any, infer L extends UnknownRecord> ? L : never;

const y0 = <X, L extends UnknownRecord = {}, D extends Done = undefined>(
  x: Cb<X>,
  L: L,
  $: ($: yBlock<X, L, __>) => D,
): yBlock<X, L, D> => u(a(L, { x }) as yBlock<X, L, __>, (x) => ({ d: $(x) }));

const y = <X, L extends UnknownRecord = {}, D extends Done = undefined, P extends y = y>(
  x: Cb<X>,
  L: L,
  P: P,
  $: ($: yBlock<X, L, __>, P: P) => D,
): yBlock<X, L, D> => u(a(L, { x }) as yBlock<X, L, __>, (x) => ({ d: $(x, P) }));

/**
 * Helper for disposing yBlock
 *
 * @param y yBlock to be disposed
 * @param d clean-up logic
 * @returns a function that should be assigned to y.d; once called with (prev: false) it will unset y.d
 */
const d =
  (y: yBlock, d: (fromPrev: boolean, y: yBlock) => void) =>
  (fromPrev = false) => {
    if (!y.d) return; // already disposed OR just marked as disposed
    if (fromPrev) {
      d(fromPrev, y);
      let n = y.n;
      while (n && !n.d) {
        // find closest next which is disposable
        n = n.n;
      }
      n?.d && n.d(fromPrev);
    } else {
      let p = y as __<yBlock>;
      while (p) {
        if (p.d) {
          const d = p.d.bind(p);
          p.d = 0; // mark as disposed
          d();
        }
        p = p.p;
      }
    }
  };

/**
 * Connects two yBlocks
 *
 * `(p.n = n), (n.p = p))`
 *
 * @param p prev yBlock
 * @param n next yBlock
 * @returns void
 */
const y2y = <Prev extends yBlock, Next extends yBlock>(p: Prev, n: Next) => ((p.n = n), (n.p = p));
