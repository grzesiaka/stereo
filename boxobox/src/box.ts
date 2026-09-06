import { Static, TypierBase } from "typier";
import { $$, ARR } from "~types";
import { Simplify } from "type-fest";
import { Dict, KeyValues$Object } from "jsyoyo";

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
}

export type $Box<
  IDorCtx extends string | { ID: string },
  IN extends Ports = Ports,
  OUT extends Ports = Ports,
  Extra extends {} = {},
> = Extra &
  (IDorCtx extends {
    ID: string;
  }
    ? Simplify<Omit<IDorCtx, "ID">> & Box<IDorCtx["ID"], IN, OUT>
    : IDorCtx extends string
      ? Box<IDorCtx, IN, OUT>
      : never);

export type $$Box<IN extends Ports = Ports, OUT extends Ports = Ports, Extra extends {} = {}> = <
  IDorCtx extends string | { ID: string },
>(
  ctx: IDorCtx,
) => $Box<IDorCtx, IN, OUT, Extra>;

export type Boxes = ARR<Box>;

export type Source<ID extends string = string, OUT extends Ports = Ports> = Box<ID, [], OUT>;

export type Sink<ID extends string = string, IN extends Ports = Ports> = Box<ID, IN, []>;

export const $box =
  <const IN extends Ports, const OUT extends Ports, Extra extends {} = {}>(IN: IN, OUT: OUT, Extra = {} as Extra) =>
  <IDorCtx extends string | { ID: string }>(ctx: IDorCtx) =>
    (typeof ctx === "string"
      ? { ID: ctx, IN, OUT, ...Extra }
      : Object.assign({ IN, OUT }, Extra, ctx)) as never as $Box<IDorCtx, IN, OUT, Extra>;

export const box =
  <const IN extends Ports>(...IN: IN) =>
  <const OUT extends Ports>(...OUT: OUT) =>
    $box(IN, OUT);

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

export type PortRef<P extends ARR> = P extends readonly [...infer H, infer R]
  ? PortRef<H> | (R extends { $KEY: infer Key } ? Key : `${H["length"]}` & keyof P)
  : P extends readonly []
    ? never
    : string;
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

export type Ports$PortIdPort<ID extends string, S extends INPUT_SYM | OUTPUT_SYM, P extends ARR> = P extends readonly [
  ...infer H,
  infer R,
]
  ? [
      ...Ports$PortIdPort<ID, S, H>,
      [`${ID}${S}${R extends { $KEY: infer Key extends string } ? Key : `${H["length"]}` & keyof P}`, R],
    ]
  : P extends readonly []
    ? []
    : ARR<[string, P[number]]>;

export type PortsWithIdIN<Bs extends Boxes> = Bs extends readonly [infer B extends Box, ...infer R extends Boxes]
  ? [...Ports$PortIdPort<B["ID"], "<-", B["IN"]>, ...PortsWithIdIN<R>]
  : [];

export type PortsWithIdOUT<Bs extends Boxes> = Bs extends readonly [infer B extends Box, ...infer R extends Boxes]
  ? [...Ports$PortIdPort<B["ID"], "->", B["OUT"]>, ...PortsWithIdOUT<R>]
  : [];

export type PortsByKey<Bs extends Boxes> = {
  IN: KeyValues$Object<PortsWithIdIN<Bs>>;
  OUT: KeyValues$Object<PortsWithIdOUT<Bs>>;
};

export const portsByKey = <const Bs extends Boxes>(bs: Bs) => {
  const IN = {} as Dict<unknown, string>;
  const OUT = {} as Dict<unknown, string>;

  for (const b of bs) {
    b.IN.forEach((p: any, i) => (IN[inputId(b.ID, p?.$KEY || i)] = p));
    b.OUT.forEach((p: any, i) => (OUT[outputId(b.ID, p?.$KEY || i)] = p));
  }

  return {
    IN,
    OUT,
  } as never as PortsByKey<Bs>;
};
