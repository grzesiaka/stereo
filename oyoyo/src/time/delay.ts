import { DISPOSE, Fn$O, id, MsOrNumber, timeout } from "jsyoyo";
import { OP, $OP, Yo, oYo, Yo$X } from "../base/yo";

export type Delay<Ms extends MsOrNumber, Prev extends Yo> = OP<Yo$X<Prev>, Prev, {}, "delay", Ms>;
export type Delay$<Ms extends MsOrNumber, Prev extends oYo> = $OP<Delay<Ms, Fn$O<Prev>>>;
export type DelayOp = <Ms extends MsOrNumber, Prev extends oYo>(ms: Ms) => (Y: Prev) => Delay$<Ms, Prev>;

export const delay = Yo<"delay", [MsOrNumber], MsOrNumber>(
  "delay",
  id,
)<{ [DISPOSE]: () => void }>(
  ($, P) => ($.Y = P((x) => ($[DISPOSE] = timeout($.__[1], () => $.o(x))))),
) as never as DelayOp;
