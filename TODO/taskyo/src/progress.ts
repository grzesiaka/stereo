import { Var } from "ioioy";
import { TaskSpec } from "./task";
import { $$, __ } from "jsyoyo";

export type ProgressSpec<Units extends string = string, Max extends __<number> = __<number>> = [units: Units, max: Max];
export type ProgressRunParams<S extends ProgressSpec> = __ extends S[1] ? (S[1] extends __ ? [] : [$$<S[1]>]) : [];
export interface ProgressInfo<S extends ProgressSpec> {
  unit: S[0];
  total: S[1];
  value: S[1] | 0;
  aborted?: boolean;
  _01: number; // TODO clamped
}

export type ProgressVar<ID extends string, S extends ProgressSpec> = Var<ID, ProgressInfo<S>, Partial<ProgressInfo<S>>>;

export type ProgressUpdate<ID extends string, S extends ProgressSpec> = (() => ProgressVar<ID, S>) &
  ((...v: [S[1]]) => ProgressVar<ID, S>["X"]);

export const $progress = <Spec extends Pick<TaskSpec, "progress" | "ID">>(
  spec: Spec,
  ...init: ProgressRunParams<Spec["progress"]>
): ProgressUpdate<Spec["ID"], Spec["progress"]> => {
  const p = spec.progress;
  const total = init[0] || p[1];
  const x = Var(
    {
      unit: p[0],
      total,
      value: 0,
      get _01() {
        return x.X.total === __ ? __ : Math.trunc((1000 * x.X.value) / x.X.total) / 1000;
      },
    },
    spec.ID,
  );
  return ((...v: [Spec["progress"][1]?]) => {
    if (v.length === 0) return x;
    x.X.value = Math.min(v[0] || 0, x.X.total || 0);
    x.I(x.X);
    return x.X;
  }) as never;
};
