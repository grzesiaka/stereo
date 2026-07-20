import { TypierBase } from "typier";
import { ARR, WithTag } from "~types";

export type Port = unknown;
export type Ports<INorOUT extends ARR<Port> = ARR<Port>> = INorOUT;

export type INPUT_SYM = "<<";
export type OUTPUT_SYM = ">>";

export type Input<P extends Port = Port> = WithTag<P, "[INPUT]">;
export type Output<P extends Port = Port> = WithTag<P, "[OUTPUT]">;

export type MarkInputs<IN extends ARR<Port> = ARR<Port>> = IN extends readonly [
  infer H extends Port,
  ...infer R extends ARR<Port>,
]
  ? [Input<H>, ...MarkInputs<R>]
  : IN extends readonly []
    ? []
    : ARR<Input<Port>>;
export type MarkOutputs<OUT extends ARR<Port> = ARR<Port>> = OUT extends readonly [
  infer H extends Port,
  ...infer R extends ARR<Port>,
]
  ? [Output<H>, ...MarkOutputs<R>]
  : OUT extends readonly []
    ? []
    : ARR<Output<Port>>;

export type Box<
  ID extends string = string,
  IN extends Ports = Ports,
  OUT extends Ports = Ports,
  Extra extends ARR = ARR,
> = readonly [ID, MarkInputs<IN>, MarkOutputs<OUT>, ...Extra];

export type Boxes = ARR<Box>;

export type Source<ID extends string = string, OUT extends Ports = Ports, Extra extends ARR = ARR> = Box<
  ID,
  [],
  OUT,
  Extra
>;

export type Sink<ID extends string = string, IN extends Ports = Ports, Extra extends ARR = ARR> = Box<
  ID,
  IN,
  [],
  Extra
>;

export const box =
  <IN extends Ports>(...IN: IN) =>
  <OUT extends Ports>(...OUT: OUT) =>
  <ID extends string, Extra extends ARR>(ID: ID, ...E: Extra) =>
    [ID, IN, OUT, ...E] as never as Box<ID, IN, OUT, Extra>;

export const source = <OUT extends Ports>(...OUT: OUT) => box()(...OUT);
export const sink = <IN extends Ports>(...IN: IN) => box(...IN)();

export type PortsId<P extends ARR> = Exclude<keyof P & string, keyof []> | Extract<P[number], TypierBase>["$KEY"];
export type BoxToInputs<B extends Box = Box> = PortsId<B[1]>;
export type BoxToOutputs<B extends Box = Box> = PortsId<B[2]>;
export const input =
  <B extends Box>(b: B) =>
  <const P extends BoxToInputs<B>>(p: P) =>
    `${b[0]}<-${p}` as `${B[0]}${INPUT_SYM}${P}`;

import { N, S } from "typier";
const name = S()("name");
const age = N()("age");
const b = box(name, age)(name, age)("name_age");

type I = BoxToInputs<typeof b>;
const i = input(b)("0");
