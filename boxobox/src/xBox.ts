import { box, Box, Boxes, Ports } from "./box";
import { Wires1to1, WireFrom, WireTo, AutoWire } from "./wire";

export interface xBox<
  ID extends string = string,
  BS extends Boxes = Boxes,
  WS extends Wires1to1<BS[number]> = Wires1to1<BS[number]>,
  IN extends Ports = Ports,
  OUT extends Ports = Ports,
> extends Box<ID, IN, OUT> {
  BOXES: BS;
  WIRES: WS;
}

export const xBox = <const Bs extends Boxes, const Ws extends Wires1to1<Bs[number]>>(
  bs: Bs,
  ws: (from: WireFrom<Bs>, to: WireTo<Bs>) => Ws,
) => 1;

const b = xBox([box("1", 2)(3, 4, 2, "1")("T")], (f, t) => [f("T->2")("T<-1"), t("T<-0")("T->3"), ["T->3", "T<-0"]]);

export default xBox;
