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
import { isTypier } from "typier";
import { Simplify, Includes } from "type-fest";

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
  <To extends CompatibleTargetIds<Bs, NoInfer<From>>[]>(...to: To) =>
    [from, to.length === 1 ? to[0] : to, ...extra] as [From, To extends { length: 1 } ? To[0] : To, ...Extra];

export type CompatibleDestinationIds<Bs extends Boxes, To extends InputId<Bs[number]>> = {
  [K in OutputId<Bs[number]>]: Wire<Bs, K, To> extends never ? never : K;
}[OutputId<Bs[number]>];

export const to =
  <const Bs extends Boxes>(_?: Bs) =>
  <To extends InputId<Bs[number]>, Extra extends ARR = []>(to: To, ...extra: Extra) =>
  <From extends CompatibleDestinationIds<Bs, To>[]>(...from: From) =>
    [from.length === 1 ? from[0] : from, to, ...extra] as [From extends { length: 1 } ? From[0] : From, To, ...Extra];

type AutoWireable<
  ID extends string,
  Dir extends INPUT_SYM | OUTPUT_SYM,
  Ps,
  Acc extends Dict<string[]>,
> = Ps extends readonly [infer H, ...infer R]
  ? AutoWireable<
      ID,
      Dir,
      R,
      H extends { $KEY: infer K extends string; $TYP: infer T extends string }
        ? T extends keyof Acc
          ? Omit<Acc, T> & { [t in T]: [...Acc[T], `${ID}${Dir}${K}`] }
          : Acc & { [t in T]: [`${ID}${Dir}${K}`] }
        : Acc
    >
  : Acc;

type PrepareAutoOutputs<Boxes, Acc extends Dict<string[]> = {}> = Boxes extends readonly [
  infer H extends Box,
  ...infer R,
]
  ? PrepareAutoOutputs<R, AutoWireable<H["ID"], "->", H["OUT"], Acc>>
  : Simplify<Acc>;

type PrepareAutoInputs<Boxes, Acc extends Dict<string[]> = {}> = Boxes extends readonly [
  infer H extends Box,
  ...infer R,
]
  ? PrepareAutoInputs<R, AutoWireable<H["ID"], "<-", H["IN"], Acc>>
  : Simplify<Acc>;

type AutoOrderBox<OUT, Acc extends ARR> = OUT extends readonly [infer H, ...infer R]
  ? AutoOrderBox<
      R,
      H extends { $TYP: infer T extends string } ? (Includes<Acc, T> extends true ? Acc : [...Acc, T]) : Acc
    >
  : Acc;
type AutoOrder<Boxes, Acc extends ARR = []> = Boxes extends readonly [infer H extends Box, ...infer R]
  ? AutoOrder<R, AutoOrderBox<H["OUT"], Acc>>
  : Acc;

const prepareAuto = <const Bs extends Boxes>(bs: Bs) => {
  const outs = {} as Dict<string[], string>;
  const ins = {} as Dict<string[], string>;
  const order = [] as string[];
  for (const b of bs) {
    for (const p of b.OUT) {
      if (isTypier(p)) {
        if (!order.includes(p.$TYP)) {
          outs[p.$TYP] = [];
          order.push(p.$TYP);
        }
        const n = outs[p.$TYP]!;
        n.push(outputId(b.ID, p.$KEY));
      }
    }
  }
  // TODO is it better to iterate boxes twice OR once and filter out not matched
  for (const b of bs) {
    for (const p of b.IN) {
      if (isTypier(p) && outs[p.$TYP]) {
        const n = ins[p.$TYP] || [];
        ins[p.$TYP] = n;
        // if no output auto wire impossible
        n.push(inputId(b.ID, p.$KEY));
      }
    }
  }
  return [order, outs, ins] as any as [AutoOrder<Bs>, PrepareAutoOutputs<Bs>, PrepareAutoInputs<Bs>];
};

export type AutoWire<
  Bs extends Boxes,
  Order = AutoOrder<Bs>,
  Outs extends PrepareAutoOutputs<Bs> = PrepareAutoOutputs<Bs>,
  Ins extends PrepareAutoInputs<Bs> = PrepareAutoInputs<Bs>,
> = Order extends readonly [infer H extends keyof Outs & keyof Ins, ...infer R]
  ? [[Outs[H] extends [infer X] ? X : Outs[H], Ins[H] extends [infer X] ? X : Ins[H]], ...AutoWire<Bs, R>]
  : [];

export const autoWire = <const Bs extends Boxes>(bs: Bs) => {
  const [order, outs, ins] = prepareAuto(bs);
  return order.map((o) => [
    (outs[o] as any).length === 1 ? outs[o][0] : outs[o],
    (ins[o] as any).length === 1 ? ins[o][0] : ins[o],
  ]) as AutoWire<Bs>;
};

export const wirer = <const Bs extends Boxes>(bs: Bs) => ({
  from: from(bs),
  to: to(bs),
  auto: autoWire(bs),
});
