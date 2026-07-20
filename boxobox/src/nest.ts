import { ARR } from "~types";
import { Static } from "typier";
import { Box, Boxes, Ports } from "./box";

export type Wire<
  FROM extends Box = Box,
  TO extends Box = Box,
  OUT extends FROM[2][number] = FROM[2][number],
  IN extends TO[1][number] = TO[1][number],
> = Static<OUT> extends Static<IN> ? [[FROM, TO], [OUT, IN]] : never;

export type Wires<BOXES extends Boxes = Boxes> = ARR<Wire<BOXES[number], BOXES[number]>>;

export type Nest<
  ID extends string = string,
  IN extends Ports = Ports,
  OUT extends Ports = Ports,
  BOXES extends Boxes = Boxes,
  WIRES extends Wires<BOXES> = Wires<BOXES>,
  Extra extends ARR = ARR,
> = Box<ID, IN, OUT, ["[NEST]", BOXES, WIRES, ...Extra]>;

type BoxesToOutputs

const wire = <BOXES extends Boxes>(bb: BOXES) => 1

export const nest =
  <const BOXES extends ARR<Box>>(...boxes: BOXES) =>
  <const WIRES extends Wires<BOXES>>(...wires: WIRES) =>
    [boxes, wires] as [BOXES, WIRES];

import { box } from "./box";
import { N, S } from "typier";

const ID = S()("ID");
const NUM = N()("NUM");
const bID = box(ID)(ID)("id-box");
const bID2 = box(NUM)(NUM)("id-box2");
const t = nest(
  bID,
  bID2,
)([
  [bID, bID2],
  [bID[2][0], bID2[1][0]],
]);

const w = t[1][0][1];
type O = Static<(typeof w)[0]>;
type I = Static<(typeof w)[1]>;
type Z = O extends I ? 1 : 0;
