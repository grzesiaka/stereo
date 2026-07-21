import { ARR } from "~types";
import {
  Box,
  Boxes,
  DerefPort,
  InputId,
  InputIdWithType,
  OutputId,
  OutputId$Type,
  Port$Type,
  PortId$BoxIdAndRef,
  PortRef,
} from "./box";

export type Wires<Bs extends Boxes> = ARR<
  [OutputId<Bs[number]>, InputId<Bs[number]> | ARR<InputId<Bs[number]>>, unknown?]
>;

export interface Nest<Bs extends Boxes, Ws extends Wires<Bs>> {
  boxes: Bs;
  wires: Ws;
}

// export type WirePorts<Bs extends Boxes, From extends OutputId<Bs[number]>, To extends InputId<Bs[number]>> = {
//   From: Extract<Bs[number], { ID: PortId$BoxIdAndRef<From>["ID"] }>["OUT"][PortId$BoxIdAndRef<From>["PortRef"] &
//     keyof Bs[number]["OUT"]];
//   To: Extract<Bs[number], { ID: PortId$BoxIdAndRef<To>["ID"] }>["IN"][PortId$BoxIdAndRef<From>["PortRef"] &
//     keyof Bs[number]["IN"]];
// };

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
      : //  [FromT, ToT]
        never
    : never;

export const wire =
  <const Bs extends Boxes>(bs: Bs) =>
  <From extends OutputId<Bs[number]>>(from: From) =>
  <To extends InputId<Bs[number]>>(to: To): Wire<Bs, From, To> =>
    [from, to] as any;

// import { ARR } from "~types";
// import { Static } from "typier";
// import { Box, Boxes, Ports } from "./box";

// export type Wire<
//   FROM extends Box = Box,
//   TO extends Box = Box,
//   OUT extends FROM[2][number] = FROM[2][number],
//   IN extends TO[1][number] = TO[1][number],
// > = Static<OUT> extends Static<IN> ? [[FROM, TO], [OUT, IN]] : never;

// export type Wires<BOXES extends Boxes = Boxes> = ARR<Wire<BOXES[number], BOXES[number]>>;

// export type Nest<
//   ID extends string = string,
//   IN extends Ports = Ports,
//   OUT extends Ports = Ports,
//   BOXES extends Boxes = Boxes,
//   WIRES extends Wires<BOXES> = Wires<BOXES>,
//   Extra extends ARR = ARR,
// > = Box<ID, IN, OUT, ["[NEST]", BOXES, WIRES, ...Extra]>;

// type BoxesToOutputs

// const wire = <BOXES extends Boxes>(bb: BOXES) => 1

// export const nest =
//   <const BOXES extends ARR<Box>>(...boxes: BOXES) =>
//   <const WIRES extends Wires<BOXES>>(...wires: WIRES) =>
//     [boxes, wires] as [BOXES, WIRES];

// import { box } from "./box";
// import { N, S } from "typier";

// const ID = S()("ID");
// const NUM = N()("NUM");
// const bID = box(ID)(ID)("id-box");
// const bID2 = box(NUM)(NUM)("id-box2");
// const t = nest(
//   bID,
//   bID2,
// )([
//   [bID, bID2],
//   [bID[2][0], bID2[1][0]],
// ]);

// const w = t[1][0][1];
// type O = Static<(typeof w)[0]>;
// type I = Static<(typeof w)[1]>;
// type Z = O extends I ? 1 : 0;
