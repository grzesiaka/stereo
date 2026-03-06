import { __, ARR, Cb, Fn } from "~js";
import capped, { Capped } from "~js/ds/capped.js";

type Callees<X = unknown> = Set<Cb<X>>;

type InputPlus<RawInput extends ARR = ARR, X = RawInput[0], M extends __<Capped<X>> = __<Capped<X>>> = ((
  ...x: RawInput
) => void) & {
  callees: Callees<X>;
  transform: __<Fn<RawInput, X>>;
  memory: M;
};

export const $input = <X, RawInput extends ARR, Memory extends Capped<X, number> | number = 1>(
  memory = capped<1, X>(1) as Memory,
  transform = __ as __<Fn<RawInput, X>>,
  callees = new Set<Cb<X>>(),
): InputPlus<RawInput, X, 0 extends Memory ? __ : Memory extends number ? Capped<X, Memory> : Memory> => {
  const $: InputPlus<RawInput, X, 0 extends Memory ? __ : Memory extends number ? Capped<X, Memory> : Memory> = (
    ...x
  ) => {
    const v = $.transform?.(...x) || x[0];
    $.memory?.push(v);
    $.callees.forEach((c) => c(v));
  };

  $.memory = (memory === 0 ? __ : typeof memory === "number" ? capped(memory) : memory) as 0 extends Memory
    ? __
    : Memory extends number
      ? Capped<X, Memory>
      : Memory;
  $.transform = transform;
  $.callees = callees;

  return $;
};

export default $input;
