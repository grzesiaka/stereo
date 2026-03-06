import { $clamp } from "./interval";
export const calc = $clamp()(0, 1);
export const $progress = (total, units = "", current = 0) => {
    const $ = {
        total,
        units,
        update: (x) => (($.current = x), ($.progress = calc(x / $.total)), $),
    };
    $.update(current);
    return $;
};
