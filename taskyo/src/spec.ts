import { __, Dict, FirstMatch, Fn, Fn$O } from "jsyoyo";

import type { Load, Load$State, PartialSpec, RunState, RunFn, Spec, SpecCore, SpecExtra, UpdateFn } from "./types";

type SpecCoreKeys = Exclude<keyof SpecCore, "Id">;
type SpecNonCore = Omit<PartialSpec, SpecCoreKeys>;
export const isSpec = (s: object): s is Spec => "run" in s && "Id" in s;
export const spec =
  <const Proto extends Dict>(proto = {} as Proto & SpecNonCore & Dict<never, Extract<keyof Proto, SpecCoreKeys>>) =>
  <
    Lo extends Load = __,
    State extends RunState | Load$State<Lo, RunState> = {},
    Update extends UpdateFn<Lo, Fn$O<State, State & RunState>> = __,
  >(
    load = __ as Lo,
    state = {} as State,
    update = __ as Update,
  ) =>
  <Params, Result, const RunExtra extends SpecExtra>(
    run: RunFn<Params, Result, Lo, Fn$O<State, State & RunState>>,
    runExtra = {} as RunExtra & SpecNonCore & Dict<never, Extract<keyof RunExtra, SpecCoreKeys>>,
  ) =>
  <const Id extends Proto & RunExtra extends { Id: string } ? [string?] : [string]>(...[Id]: Id) =>
    ({
      ...proto,
      ...runExtra,
      Id: Id || runExtra["Id"] || proto["Id"] || "",
      load,
      state,
      update,
      run,
    }) as never as Certain<
      {
        Id: FirstMatch<[Id[0], RunExtra["Id"], Proto["Id"]], string, never>;
        load: Lo;
        state: State;
        run: RunFn<Params, Result, Lo, State extends Fn ? Fn$O<State> : State>;
        update: Update;
      } & Omit<Merge<RunExtra, Proto>, "Id" | SpecCoreKeys>
    >; // TODO if needed try to pack it in a type (but exactness is more important)

type Certain<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

type Merge<A, B> = Certain<A> & Omit<Certain<B>, keyof Certain<A>>;

export default spec;
