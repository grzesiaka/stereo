import type { Tagged } from "type-fest";
import { IntervalTagMeta } from "./interval";
import { Fn$O } from "../";
export type ProgressValue<V extends number = number> = Fn$O<typeof calc<V>>;
export type Percent = Tagged<number, "%">;
export type Percent_0_100<FractionalPart extends string = ""> = Tagged<number, "%", IntervalTagMeta<0, 100, "]", FractionalPart>>;
export interface ProgressTrackerBase<Total extends number = number, Units = undefined, Current extends number = Total> {
    progress: ProgressValue;
    current: Current;
    total: Total;
    units: Units;
}
export interface ProgressTracker<Total extends number = number, Units = undefined, Current extends number = Total> extends ProgressTrackerBase<Total, Units, Current> {
    update: (x: Current) => this;
}
export declare const calc: <V extends number>(val: V) => Tagged<V, "progress", "[0..1]">;
export declare const $progress: <Total extends number, Units = "", Current extends number = Total>(total: Total, units?: Units, current?: Current) => ProgressTracker<Total, Units, Current>;
//# sourceMappingURL=%25.d.ts.map