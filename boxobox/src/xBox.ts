import { es, vs } from "jsyoyo";
import { $Box, $box, Boxes, Ports, PortsByKey, portsByKey, PortsWithIdIN, PortsWithIdOUT } from "./box";
import { WireFrom, WireTo, AutoWire, Wires, from, to, FlatWires, autoWire } from "./wire";
import { Simplify } from "type-fest";
import { ij_Project } from "proyij"; // this might be an overkill TODO use a simple projection

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

export type FreePortsByKey<Bs extends Boxes, Ws extends Wires> = {
  IN: Simplify<Pick<PortsByKey<Bs>["IN"], FreePortsIN<Bs, Ws>[number][0]>>;
  OUT: Simplify<Pick<PortsByKey<Bs>["OUT"], FreePortsOUT<Bs, Ws>[number][0]>>;
};
export const freePortsByKey = <const Bs extends Boxes, const Ws extends Wires>(Bs: Bs, Ws: Ws) => {
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
  return byKey as FreePortsByKey<Bs, Ws>;
};

export type FreePortsKV<Bs extends Boxes, Ws extends Wires> = {
  byKey: FreePortsByKey<Bs, Ws>;
  IN: FreePortsIN<Bs, Ws>;
  OUT: FreePortsOUT<Bs, Ws>;
};
export const freePortsKV = <const Bs extends Boxes, const Ws extends Wires>(Bs: Bs, Ws: Ws) => {
  const byKey = freePortsByKey(Bs, Ws);
  return {
    byKey,
    IN: es(byKey.IN),
    OUT: es(byKey.OUT),
  } as never as FreePortsKV<Bs, Ws>;
};

export type FreePorts<Bs extends Boxes, Ws extends Wires> = {
  byKey: FreePortsByKey<Bs, Ws>;
  IN: ij_Project<[1], FreePortsIN<Bs, Ws>>;
  OUT: ij_Project<[1], FreePortsOUT<Bs, Ws>>;
};
export const freePorts = <const Bs extends Boxes, const Ws extends Wires>(Bs: Bs, Ws: Ws) => {
  const byKey = freePortsByKey(Bs, Ws);
  return {
    byKey,
    IN: vs(byKey.IN),
    OUT: vs(byKey.OUT),
  } as never as FreePorts<Bs, Ws>;
};

export type xBox<
  IDorCtx extends string | { ID: string },
  IN extends Ports = Ports,
  OUT extends Ports = Ports,
  BOXES extends Boxes = Boxes,
  WIRES extends Wires<BOXES[number]> = Wires<BOXES[number]>,
> = $Box<IDorCtx, IN, OUT, { "][": BOXES; "><": WIRES }>;

export type xBoxesFn = <
  const Bs extends Boxes,
  const $Wires extends Wires<Bs[number]>,
  const PreWires extends Wires<Bs[number]> = [],
  const IO extends { IN: Ports; OUT: Ports } = FreePorts<Bs, [...PreWires, ...$Wires]>,
>(
  boxes: Bs,
  wires: (from: WireFrom<Bs, PreWires>, to: WireTo<Bs, PreWires>) => $Wires,
  IO?: (boxes: Bs, wires: NoInfer<$Wires>, preWires: NoInfer<PreWires>) => IO,
  preWires?: PreWires,
) => <IDorCtx extends string | { ID: string }>(
  ctx: IDorCtx,
) => xBox<IDorCtx, IO["IN"], IO["OUT"], Bs, [...$Wires, ...PreWires]>;

export const x: xBoxesFn = (bs, ws, io, pre = [] as any) => {
  const w = ws(from._, to._);
  const p = io ? io(bs, w, pre) : freePorts(bs, w.concat(pre));
  return $box(p.IN, p.OUT, { "][": bs, "><": ws(from._, to._).concat(pre) as any });
};

export type xBoxesFnAuto = <
  const Bs extends Boxes,
  const $Wires extends Wires<Bs[number], never> = [],
  const IO extends { IN: Ports; OUT: Ports } = FreePorts<Bs, [...AutoWire<Bs>, ...$Wires]>,
>(
  boxes: Bs,
  wires?: (from: WireFrom<Bs, AutoWire<Bs>>, to: WireTo<Bs, AutoWire<Bs>>) => $Wires,
  IO?: (boxes: Bs, wires: NoInfer<$Wires>, preWires: AutoWire<Bs>) => IO,
) => <IDorCtx extends string | { ID: string }>(
  ctx: IDorCtx,
) => xBox<IDorCtx, IO["IN"], IO["OUT"], Bs, [...$Wires, ...AutoWire<Bs>]>;

export const xx: xBoxesFnAuto = (bs, ws, io) => x(bs, ws || ((() => []) as any), io, autoWire(bs));
