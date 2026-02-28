import { __, a, ARR } from "../0";
import { WithState, yR, yR2X, yR_Base } from "./0";

type ScanParamsRaw = [init: (...L: ARR) => unknown, next: (v: unknown, s: unknown, ...L: ARR) => typeof s];
export const S = yR<"S", [ScanParamsRaw[1]] | ScanParamsRaw, ScanParamsRaw>("S", (...p: any) =>
  p[1] ? p : (p.unshift(() => __), p),
)(($, P, _, L) => {
  $.v = $.__[0][0](...L);
  return a($, {
    p: P((x) => (($.v = $.__[0][1](x, $.v, ...L) as any), $.x($.v))),
  } as _Scan);
}) as ScanOp;

export interface _Scan<X = unknown, P extends yR = yR> extends yR_Base<X, P>, WithState<X> {}
export type Scan<X, P extends yR> = yR<X, _Scan<X, P>>;
export type ScanOp = (<P extends yR, const X, L extends ARR>(
  init: (...L: L) => X,
  next: (v: yR2X<P>, s: NoInfer<X>, ...L: L) => NoInfer<X>,
) => (P: P, ...L: L) => Scan<X, P>) &
  (<P extends yR, X, L extends ARR>(
    next: (v: yR2X<P>, s: __<X>, ...L: L) => NoInfer<X>,
  ) => (P: P, ...L: L) => Scan<X, P>);
