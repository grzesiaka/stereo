import { Boxes, DerefPort, InputId, OutputId, Port$Type, PortId$BoxIdAndRef } from "./box";

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
    ? ToT extends FromT
      ? [From, To]
      : never
    : never;

// type Wires<
//   Bs extends Boxes,
//   From extends OutputId<Bs[number]>,
//   To extends ARR<InputId<Bs[number]>>,
// > = To extends [infer H extends InputId<Bs[number]>, ...infer R extends ARR<InputId<Bs[number]>>]
//   ? [Wire<Bs, From, H>, ...Wires<Bs, From, R>]
//   : [];

type CompatibleInputIds<Bs extends Boxes, From extends OutputId<Bs[number]>> = {
  [K in InputId<Bs[number]>]: Wire<Bs, From, K> extends never ? never : K;
}[InputId<Bs[number]>];

export const wire =
  <const Bs extends Boxes>(_?: Bs) =>
  <From extends OutputId<Bs[number]>>(from: From) =>
  <To extends CompatibleInputIds<Bs, From>[]>(...to: To): [From, To] =>
    [from, to] as any;
