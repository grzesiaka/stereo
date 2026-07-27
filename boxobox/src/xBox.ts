import { box, Box, Boxes, Ports, portsByKey } from "./box";
import { Wires1to1, WireFrom, WireTo, AutoWire, Wires, from, to, Wire } from "./wire";

export const freePorts = <Bs extends Boxes, Ws extends Wires<Bs[number], readonly [string[], string[]]>>(
  Bs: Bs,
  Ws: Ws,
) => {
  const ports = portsByKey(Bs);
  for (const w of Ws) {
    const [from, to] = w as never as [string | string[], string | string[]];
    if (Array.isArray(from)) {
      from.forEach((f) => delete ports.OUT[f as never]);
    } else {
      delete ports.OUT[from as never];
    }
    if (Array.isArray(to)) {
      to.forEach((f) => delete ports.IN[f as never]);
    } else {
      delete ports.IN[to as never];
    }
  }
  return ports;
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
