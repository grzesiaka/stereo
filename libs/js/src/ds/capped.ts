import { a } from "../";

export type Capped<X = unknown, N extends number | undefined = number | undefined> = X[] &
  (number | undefined extends N ? { cap?: N } : { cap: N });

/**
 * Creates a mutable capped array; cap is only respected when adding single items via `.push`
 * @param c Cap / max items
 * @param $ initial array defaults to []
 * @returns a capped array
 */
export const capped = <Cap extends number | undefined, X>(c?: Cap, ...$: X[]): Capped<X, Cap> =>
  c === void 0
    ? ($ as Capped<X, Cap>)
    : a(($.length > c && $.splice(0, $.length - c), $), {
        cap: c,
        _push: $.push.bind($),
        push:
          c === 0
            ? () => 0
            : (x: X) => (
                $.length === ($ as Capped<unknown, number>).cap && $.shift(),
                ($ as any as { _push: any })._push(x) as number
              ),
      });
capped.isFull = (a: Capped) => "cap" in a && a.length >= (a.cap as number);

export default capped;
