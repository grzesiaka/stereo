import { IdIOs, IO$Id } from "./io";

export type IOsById<IOs extends IdIOs, X = IOs[number]> =
  IO$Id<X> extends PropertyKey ? { [K in IO$Id<X>]: Extract<X, { O: { Id: K } }> } : never;

/**
 * Creates an object from an array of IOs each with `Id`, by using `Id` as the key.
 *
 * @param ios IOs with `Id`s
 * @param act optional callback to perform some side effects; maybe handy in preventing extra looping
 * @returns object with entries formed from original `ios` array
 */
export const iosById = <IOs extends IdIOs, Init extends {} = {}>(
  ios: IOs,
  act?: <IO extends IOs[number]>(...[io, id]: [IO, IO["O"]["Id"]]) => void,
  initO = {} as Init,
) =>
  act
    ? ios.reduce((a, n) => (((a as any)[n.O.Id] = n), act(n, n.O.Id), a), initO as Init & IOsById<IOs>)
    : ios.reduce((a, n) => (((a as any)[n.O.Id] = n), a), initO as Init & IOsById<IOs>);

export default iosById;
