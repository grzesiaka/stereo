import { ij_Project, KeyValues$Object } from "proyij";
import { IdIOs, IOs$FlatTypes } from "./io";

export type IOsById<IOs extends IdIOs> = KeyValues$Object<ij_Project<["Id", "IO"], IOs$FlatTypes<IOs>>>;

export const byId = <IOs extends IdIOs>(
  ios: IOs,
  act?: <IO extends IOs[number]>(...[io, id]: [IO, IO["I"]["Id"]]) => void,
) =>
  act
    ? ios.reduce((a, n) => (((a as any)[n.I.Id] = n), act(n, n.I.Id), a), {} as IOsById<IOs>)
    : ios.reduce((a, n) => (((a as any)[n.I.Id] = n), a), {} as IOsById<IOs>);

export default byId;
