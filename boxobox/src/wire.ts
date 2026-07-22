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
    ? FromT extends ToT
      ? [From, To]
      : never
    : never;

export type CompatibleTargetIds<Bs extends Boxes, From extends OutputId<Bs[number]>> = {
  [K in InputId<Bs[number]>]: Wire<Bs, From, K> extends never ? never : K;
}[InputId<Bs[number]>];

export const from =
  <const Bs extends Boxes>(_?: Bs) =>
  <From extends OutputId<Bs[number]>>(from: From) =>
  <To extends CompatibleTargetIds<Bs, NoInfer<From>>[]>(
    ...to: To
  ): To extends { length: 1 } ? [From, To[0]] : [From, To] =>
    [from, to.length === 1 ? to[0] : to] as any;

export type CompatibleDestinationIds<Bs extends Boxes, To extends InputId<Bs[number]>> = {
  [K in OutputId<Bs[number]>]: Wire<Bs, K, To> extends never ? never : K;
}[OutputId<Bs[number]>];

export const to =
  <const Bs extends Boxes>(_?: Bs) =>
  <To extends InputId<Bs[number]>>(to: To) =>
  <From extends CompatibleDestinationIds<Bs, To>[]>(
    ...from: From
  ): From extends { length: 1 } ? [To, From[0]] : [To, From] =>
    [to, from.length === 1 ? from[0] : from] as any;
