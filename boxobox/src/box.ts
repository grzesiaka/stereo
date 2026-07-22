import { Static, TypierBase } from "typier";
import { $$, ARR } from "~types";
import { Simplify } from "type-fest";
export { __ } from "jsyoyo";

export type Port = unknown;
export type Ports<INorOUT extends ARR<Port> = ARR<Port>> = INorOUT;

export type Port$Type<P> = P extends TypierBase ? Static<P> : $$<P>;

export type INPUT_SYM = typeof INPUT_SYM;
export const INPUT_SYM = "<-";
export type OUTPUT_SYM = typeof OUTPUT_SYM;
export const OUTPUT_SYM = "->";

export const inputId = <BoxID extends string, PortRef extends string>(ID: BoxID, Ref: PortRef) =>
  `${ID}${INPUT_SYM}${Ref}` as const;
export const outputId = <BoxID extends string, PortRef extends string>(ID: BoxID, Ref: PortRef) =>
  `${ID}${OUTPUT_SYM}${Ref}` as const;

export interface Box<ID extends string = string, IN extends Ports = Ports, OUT extends Ports = Ports> {
  ID: ID;
  IN: IN;
  OUT: OUT;
  // TODO - not sure if needed to mark input outputs separately; better probably just to keep them in separate collections
  // IN: ArrWithTag<IN, INPUT_SYM>;
  // OUT: ArrWithTag<OUT, OUTPUT_SYM>;
}

export type Boxes = ARR<Box>;

export type Source<ID extends string = string, OUT extends Ports = Ports> = Box<ID, [], OUT>;

export type Sink<ID extends string = string, IN extends Ports = Ports> = Box<ID, IN, []>;

export const box =
  <IN extends Ports>(...IN: IN) =>
  <OUT extends Ports>(...OUT: OUT) =>
  <IDorCtx extends string | { ID: string }>(ctx: IDorCtx) =>
    (typeof ctx === "string" ? { ID: ctx, IN, OUT } : Object.assign({ IN, OUT }, ctx)) as never as IDorCtx extends {
      ID: string;
    }
      ? Simplify<Omit<IDorCtx, "ID">> & Box<IDorCtx["ID"], IN, OUT>
      : IDorCtx extends string
        ? Box<IDorCtx, IN, OUT>
        : never;

/** Create a box by first specifying outputs and than inputs */
box.OI =
  <OUT extends Ports>(...OUT: OUT) =>
  <IN extends Ports>(...IN: IN) =>
    box(...IN)(...OUT);

/** Creates a box by first specifying ID than inputs then outputs */
box.ID =
  <ID extends string>(ID: ID) =>
  <IN extends Ports>(...IN: IN) =>
  <OUT extends Ports>(...OUT: OUT) =>
    box(...IN)(...OUT)(ID);

/** A thin box; inputs and outputs are the same - not sure if any use case for this */
// box[1] = <Ps extends Ports>(...ps: Ps) => box(...ps)(...ps);

export const source = <OUT extends Ports>(...OUT: OUT) => box()(...OUT);
export const sink = <IN extends Ports>(...IN: IN) => box(...IN)();

export type PortRef<P extends ARR> = Exclude<keyof P & string, keyof []> | Extract<P[number], TypierBase>["$KEY"];
export type DerefPort<Ps extends ARR, PortRef> = PortRef extends keyof Ps
  ? Ps[PortRef]
  : Extract<Ps[number], { $KEY: PortRef }>;

export type InputId<B extends Box = Box> =
  B extends Box<infer ID, infer IN> ? `${ID}${INPUT_SYM}${PortRef<IN>}` : never;

export type OutputId<B extends Box = Box> =
  B extends Box<infer ID, any, infer OUT> ? `${ID}${OUTPUT_SYM}${PortRef<OUT>}` : never;

export type PortId$BoxIdAndRef<P> = P extends `${infer ID}${INPUT_SYM | OUTPUT_SYM}${infer Ref}`
  ? { ID: ID; PortRef: Ref }
  : { ID: never; PortRef: never };

// export type PortId<B extends Box = Box> = InputId<B> | OutputId<B>;

// type InputIdWithType<B extends Box = Box> =
//   B extends Box<infer ID, infer IN>
//     ? PortRef<IN> extends infer P extends string
//       ? [`${ID}${INPUT_SYM}${P}`, Port$Type<DerefPort<B["IN"], P>>]
//       : never
//     : never;
// type OutputIdWithType<B extends Box = Box> =
//   B extends Box<infer ID, any, infer OUT>
//     ? PortRef<OUT> extends infer P extends string
//       ? [`${ID}${OUTPUT_SYM}${P}`, Port$Type<DerefPort<B["OUT"], P>>]
//       : never
//     : never;

// type InputId$Type<
//   B extends Box = Box,
//   PortId extends InputId<B> = InputId<B>,
// > = PortId extends `${string}${INPUT_SYM}${infer Ref}` ? Port$Type<DerefPort<B["IN"], Ref>> : never;

// type OutputId$Type<
//   B extends Box = Box,
//   PortId extends OutputId<B> = OutputId<B>,
// > = PortId extends `${string}${OUTPUT_SYM}${infer Ref}` ? Port$Type<DerefPort<B["OUT"], Ref>> : never;

// export type Input<P extends Port = Port> = WithTag<P, INPUT_SYM>;
// export type Output<P extends Port = Port> = WithTag<P, OUTPUT_SYM>;
