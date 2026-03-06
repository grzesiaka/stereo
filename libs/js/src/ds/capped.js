import { a } from "../";
/**
 * Creates a mutable capped array; cap is only respected when adding single items via `.push`
 * @param c Cap / max items
 * @param $ initial array defaults to []
 * @returns a capped array
 */
export const capped = (c, ...$) => c === void 0
    ? $
    : a(($.length > c && $.splice(0, $.length - c), $), {
        cap: c,
        _push: $.push.bind($),
        push: c === 0
            ? () => 0
            : (x) => ($.length === $.cap && $.shift(),
                $._push(x)),
    });
capped.isFull = (a) => "cap" in a && a.length >= a.cap;
export default capped;
