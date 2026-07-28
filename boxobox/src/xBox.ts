import { es, ks } from "jsyoyo";
import { box, Box, Boxes, Ports, Ports$PortIdPort, PortsByKey, portsByKey, PortsWithIdIN, PortsWithIdOUT } from "./box";
import { Wires1to1, WireFrom, WireTo, AutoWire, Wires, from, to, Wire, FlatWires } from "./wire";
import { ARR } from "~types";
import { Simplify } from "type-fest";

export type FilterPorts<PortsWithId, Exclude> = PortsWithId extends readonly [readonly [infer ID, infer P], ...infer R]
  ? ID extends Exclude
    ? [...FilterPorts<R, Exclude>]
    : [[ID, P], ...FilterPorts<R, Exclude>]
  : [];

export type FreePortsIN<Bs extends Boxes, Ws extends Wires> = FilterPorts<PortsWithIdIN<Bs>, FlatWires<Ws>[number][1]>;
export type FreePortsOUT<Bs extends Boxes, Ws extends Wires> = FilterPorts<
  PortsWithIdOUT<Bs>,
  FlatWires<Ws>[number][0]
>;

export type FreePorts<Bs extends Boxes, Ws extends Wires> = {
  byKey: {
    IN: Simplify<Pick<PortsByKey<Bs>["IN"], FreePortsIN<Bs, Ws>[number][0]>>;
    OUT: Simplify<Pick<PortsByKey<Bs>["OUT"], FreePortsOUT<Bs, Ws>[number][0]>>;
  };
  IN: FreePortsIN<Bs, Ws>;
  OUT: FreePortsOUT<Bs, Ws>;
};

export const freePorts = <const Bs extends Boxes, const Ws extends Wires>(Bs: Bs, Ws: Ws) => {
  const byKey = portsByKey(Bs);
  for (const w of Ws) {
    const [from, to] = w as never as [string | string[], string | string[]];
    if (Array.isArray(from)) {
      from.forEach((f) => delete byKey.OUT[f as never]);
    } else {
      delete byKey.OUT[from as never];
    }
    if (Array.isArray(to)) {
      to.forEach((f) => delete byKey.IN[f as never]);
    } else {
      delete byKey.IN[to as never];
    }
  }
  return {
    byKey,
    IN: es(byKey.IN),
    OUT: es(byKey.OUT),
  } as never as FreePorts<Bs, Ws>;
};

// export interface xBox<
//   ID extends string = string,
//   BS extends Boxes = Boxes,
//   WS extends Wires1to1<BS[number]> = Wires1to1<BS[number]>,
//   IN extends Ports = Ports,
//   OUT extends Ports = Ports,
// > extends Box<ID, IN, OUT> {
//   BOXES: BS;
//   WIRES: WS;
// }

// export class xBox {
//   constructor
// } <const Bs extends Boxes, const Ws extends Wires<Bs[number]>>(
//   bs: Bs,
//   ws: (from: WireFrom<Bs>, to: WireTo<Bs>) => Ws,
// ) => ws(from(bs), to(bs));

// export default xBox;
