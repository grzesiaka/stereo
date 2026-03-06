import type { Tagged } from "type-fest";
import { $clamp, IntervalTagMeta } from "./interval";
import { __, Fn$O } from "../";

export type ProgressValue<V extends number = number> = Fn$O<typeof calc<V>>;
export type Percent = Tagged<number, "%">;
export type Percent_0_100<FractionalPart extends string = ""> = Tagged<
  number,
  "%",
  IntervalTagMeta<0, 100, "]", FractionalPart>
>;

export interface ProgressTrackerBase<Total extends number = number, Units = undefined, Current extends number = Total> {
  progress: ProgressValue;
  current: Current;
  total: Total;
  units: Units;
}

export interface ProgressTracker<
  Total extends number = number,
  Units = undefined,
  Current extends number = Total,
> extends ProgressTrackerBase<Total, Units, Current> {
  update: (x: Current) => this;
}

export const calc = $clamp<"progress">()(0, 1);

export const $progress = <Total extends number, Units = "", Current extends number = Total>(
  total: Total,
  units = "" as Units,
  current = 0 as Current,
): ProgressTracker<Total, Units, Current> => {
  const $ = {
    total,
    units,
    update: (x) => (($.current = x), ($.progress = calc(x / $.total)), $),
  } as ProgressTracker<Total, Units, Current>;
  $.update(current);
  return $;
};
