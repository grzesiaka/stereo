import { __, DISPOSE, Disposyo, disposyo, Fn$O, id, MsOrNumber, timeout } from "jsyoyo";
import { OP, $OP, Yo, oYo, Yo$X } from "../base/yo";

export type Delay<Ms extends MsOrNumber, Prev extends Yo> = OP<Yo$X<Prev>, Prev, {}, "delay", Ms>;
export type Delay$<Ms extends MsOrNumber, Prev extends oYo> = $OP<Delay<Ms, Fn$O<Prev>>>;
export type DelayOp = <Ms extends MsOrNumber, Prev extends oYo>(ms: Ms) => (Y: Prev) => Delay$<Ms, Prev>;

export const delay = Yo<"delay", [MsOrNumber], MsOrNumber>(
  "delay",
  id,
)<{ [DISPOSE]: Disposyo }>(($, P) => {
  $ = disposyo(__, $);
  $.Y = P((x) => {
    const t = timeout($.__[1], () => ($[DISPOSE]!.__.delete(t), $.o(x)));
    // (t as any).x = x; Could be of value for
    $[DISPOSE]!(t);
  });
}) as never as DelayOp;
