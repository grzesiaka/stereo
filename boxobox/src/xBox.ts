import { box, Box, Boxes, Ports } from "./box";
import { Wires1to1, WireFrom, WireTo, AutoWire, Wires, from, to } from "./wire";

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

export const xBox = <const Bs extends Boxes, const Ws extends Wires<Bs[number]>>(
  bs: Bs,
  ws: (from: WireFrom<Bs>, to: WireTo<Bs>) => Ws,
) => ws(from(bs), to(bs));

const b = xBox([box("1", 2)(3, 4, 2, "1")("T"), box("1", 3)("1")("A")], (f, t) => {
  // return [f("T->2")("T<-1"), t("T<-0")("T->3")];
  return [f("T->2")("T<-1"), t("T<-0")("T->3"), ["T->3", "T<-0"], ["T->3", "T<-0"], ["A->0", "T<-0"]];
});

export default xBox;
