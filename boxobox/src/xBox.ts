import { Box, Boxes, Ports } from "./box";

export interface xBox<ID extends string = string, IN extends Ports = Ports, OUT extends Ports = Ports> extends Box<
  ID,
  IN,
  OUT
> {}

export const xBox = <Bs extends Boxes>(_bs: Bs) => 1;

export default xBox;
