import { a, __, type Fn$O } from "../0";
import type { Pipe } from "../p";
import { yR0 } from "./0";
import type { WithObserver, WithState, yR, WithId } from "./0";

export interface _Input<X = unknown> extends WithObserver<X>, WithState<X> {
  i: (x: X) => X;
}
export type Input<X> = yR<X, _Input<X>>;
export type InputId<X, Id extends PropertyKey> = yR<X, _Input<X> & WithId<Id>>;
const $IN = yR0("IN")<_Input & WithId, [unknown, PropertyKey]>(
  ($, p) => (
    $.x($.__[0]),
    a($, {
      id: p[1],
      v: p[0],
      i: (v: unknown) => (($.v = v), $.x(v), v),
    })
  ),
) as <const L extends [unknown?]>(
  ...L: L
) => <X, Id extends __<PropertyKey> = __>(x: X, id?: Id) => Pipe<Id extends PropertyKey ? InputId<X, Id> : Input<X>, L>;
export const IN = $IN() as Fn$O<typeof $IN<[]>> & { L: typeof $IN };
IN.L = $IN;
