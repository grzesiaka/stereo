import { ARR, Dict } from "~types";
import {
  Box,
  Boxes,
  DerefPort,
  INPUT_SYM,
  inputId,
  InputId,
  OUTPUT_SYM,
  outputId,
  OutputId,
  Port$Type,
  PortId$BoxIdAndRef,
} from "./box";
import { isTypier, TypierBase } from "typier";

export type WireTypes<Bs extends Boxes, From extends OutputId<Bs[number]>, To extends InputId<Bs[number]>> = {
  From: Port$Type<
    DerefPort<Extract<Bs[number], { ID: PortId$BoxIdAndRef<From>["ID"] }>["OUT"], PortId$BoxIdAndRef<From>["PortRef"]>
  >;
  To: Port$Type<
    DerefPort<Extract<Bs[number], { ID: PortId$BoxIdAndRef<To>["ID"] }>["IN"], PortId$BoxIdAndRef<To>["PortRef"]>
  >;
};

export type Wire<Bs extends Boxes, From extends OutputId<Bs[number]>, To extends InputId<Bs[number]>> =
  WireTypes<Bs, From, To> extends { From: infer FromT; To: infer ToT }
    ? FromT extends ToT
      ? [From, To]
      : never
    : never;

export type CompatibleTargetIds<Bs extends Boxes, From extends OutputId<Bs[number]>> = {
  [K in InputId<Bs[number]>]: Wire<Bs, From, K> extends never ? never : K;
}[InputId<Bs[number]>];

export const from =
  <const Bs extends Boxes>(_?: Bs) =>
  <From extends OutputId<Bs[number]>, Extra extends ARR = []>(from: From, ...extra: Extra) =>
  <To extends CompatibleTargetIds<Bs, NoInfer<From>>[]>(...to: To): [From, To, ...Extra] => [from, to, ...extra];

export type CompatibleDestinationIds<Bs extends Boxes, To extends InputId<Bs[number]>> = {
  [K in OutputId<Bs[number]>]: Wire<Bs, K, To> extends never ? never : K;
}[OutputId<Bs[number]>];

export const to =
  <const Bs extends Boxes>(_?: Bs) =>
  <To extends InputId<Bs[number]>, Extra extends ARR = []>(to: To, ...extra: Extra) =>
  <From extends CompatibleDestinationIds<Bs, To>[]>(...from: From): [To, From, ...Extra] => [to, from, ...extra];

type AutoWireable<ID extends string, Dir extends INPUT_SYM | OUTPUT_SYM, Ps> = Ps extends readonly [infer H, ...infer R]
  ? AutoWireable<ID, Dir, R> &
      (H extends { $KEY: infer K extends string; $TYP: infer T extends string }
        ? { [t in T]: { [k in `${ID}${Dir}${K}`]: 1 } }
        : {})
  : {};

type PrepareAutoOutputs<Boxes, Acc extends Dict<Dict<1>> = {}> = Boxes extends readonly [
  infer H extends Box,
  ...infer R,
]
  ? AutoWireable<H["ID"], "->", H["OUT"]> & PrepareAutoOutputs<R, Acc>
  : Acc;

type PrepareAutoInputs<Boxes, Acc extends Dict<Dict<1>> = {}> = Boxes extends readonly [infer H extends Box, ...infer R]
  ? AutoWireable<H["ID"], "<-", H["IN"]> & PrepareAutoInputs<R, Acc>
  : Acc;

type PrepareAuto<Outputs extends PrepareAutoOutputs<Boxes>, Inputs extends PrepareAutoInputs<Boxes>> = {
  [T in keyof Outputs]: T extends keyof Inputs ? [(keyof Outputs[T])[], (keyof Inputs[T])[]] : never;
}[keyof Outputs][];

const prepareAuto = <const Bs extends Boxes>(bs: Bs) => {
  const m = {} as Dict<[string[], string[]], string>;
  for (const b of bs) {
    for (const p of b.OUT) {
      if (isTypier(p)) {
        const n = m[p.$TYP] || [[], []];
        m[p.$TYP] = n;
        n[0].push(outputId(b.ID, p.$KEY));
      }
    }
  }
  // TODO is it better to iterate boxes twice OR once and filter out not matched
  for (const b of bs) {
    for (const p of b.IN) {
      if (isTypier(p)) {
        const n = m[p.$TYP];
        if (n) {
          // if no output auto wire impossible
          n[1].push(inputId(b.ID, p.$KEY));
        }
      }
    }
  }
  return m as any as PrepareAuto<PrepareAutoOutputs<Bs>, PrepareAutoInputs<Bs>>;
};

export const autoWire = <const Bs extends Boxes>(bs: Bs) => {
  const p = prepareAuto(bs);
  return p;
};

export const wire = <const Bs extends Boxes>(_?: Bs) => ({
  from: from(_),
  to: to(_),
});
