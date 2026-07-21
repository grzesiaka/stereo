import { Static, TypierBase } from "typier";
import { $$, ARR, ArrWithTag, WithTag } from "~types";

export type Port = unknown;
export type Ports<INorOUT extends ARR<Port> = ARR<Port>> = INorOUT;

export type Port$Type<P> = P extends TypierBase ? Static<P> : $$<P>;

export type INPUT_SYM = "<-";
export type OUTPUT_SYM = "->";

export type Input<P extends Port = Port> = WithTag<P, INPUT_SYM>;
export type Output<P extends Port = Port> = WithTag<P, OUTPUT_SYM>;

export interface Box<ID extends string = string, IN extends Ports = Ports, OUT extends Ports = Ports> {
  ID: ID;
  IN: ArrWithTag<IN, INPUT_SYM>;
  OUT: ArrWithTag<OUT, OUTPUT_SYM>;
}

export type Boxes = ARR<Box>;

export type Source<ID extends string = string, OUT extends Ports = Ports> = Box<ID, [], OUT>;

export type Sink<ID extends string = string, IN extends Ports = Ports> = Box<ID, IN, []>;

export const box =
  <IN extends Ports>(...IN: IN) =>
  <OUT extends Ports>(...OUT: OUT) =>
  <ID extends string>(ID: ID) =>
    ({ ID, IN, OUT }) as never as Box<ID, IN, OUT>;

box.OUT =
  <OUT extends Ports>(...OUT: OUT) =>
  <IN extends Ports>(...IN: IN) =>
    box(...IN)(...OUT);

export const source = <OUT extends Ports>(...OUT: OUT) => box()(...OUT);
export const sink = <IN extends Ports>(...IN: IN) => box(...IN)();

export type PortRef<P extends ARR> = Exclude<keyof P & string, keyof []> | Extract<P[number], TypierBase>["$KEY"];
export type DerefPortId<Ps extends ARR, PortRef> = PortRef extends keyof Ps
  ? Ps[PortRef]
  : Extract<Ps[number], { $KEY: PortRef }>;

export type InputId<B extends Box = Box, P extends PortRef<B["IN"]> = PortRef<B["IN"]>> = `${B["ID"]}${INPUT_SYM}${P}`;
export type OutputId<
  B extends Box = Box,
  P extends PortRef<B["OUT"]> = PortRef<B["OUT"]>,
> = `${B["ID"]}${OUTPUT_SYM}${P}`;
export type PortIds<B extends Box = Box> = InputId<B> | OutputId<B>;

export type InputId$Type<
  B extends Box = Box,
  PortId extends InputId<B> = InputId<B>,
> = PortId extends `${string}${INPUT_SYM}${infer Ref}` ? Port$Type<DerefPortId<Box["IN"], Ref>> : never;

export type OutputId$Type<
  B extends Box = Box,
  PortId extends OutputId<B> = OutputId<B>,
> = PortId extends `${string}${OUTPUT_SYM}${infer Ref}` ? Port$Type<DerefPortId<Box["OUT"], Ref>> : never;

export const input =
  <B extends Box>(b: B) =>
  <const P extends PortRef<B["IN"]>>(p: P) =>
    `${b["ID"]}<-${p}` as `${B["ID"]}${INPUT_SYM}${P}`;

// import { N, S } from "typier";
// const name = S()("name");
// const age = N()("age");
// const b = box(name, age)(name, age)("name_age");

// type I = InputId<typeof b>;
// const i = input(b)("age");
