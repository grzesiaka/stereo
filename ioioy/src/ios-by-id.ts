import { ij_Project, KeyValues$Object } from "proyij";
import { IdIOs, IOs$FlatTypes } from "./io";

export type IOsById<IOs extends IdIOs> = KeyValues$Object<ij_Project<["Id", "IO"], IOs$FlatTypes<IOs>>>;

export const iosById = <IOs extends IdIOs>(
  ios: IOs,
  act?: <IO extends IOs[number]>(...[io, id]: [IO, IO["O"]["Id"]]) => void,
) =>
  act
    ? ios.reduce((a, n) => (((a as any)[n.O.Id] = n), act(n, n.O.Id), a), {} as IOsById<IOs>)
    : ios.reduce((a, n) => (((a as any)[n.O.Id] = n), a), {} as IOsById<IOs>);

export default iosById;
