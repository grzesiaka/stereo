import { __, Dict, FirstMatch, Fn, Fn$O } from "jsyoyo";

import type { Load, Load$Ctx, PartialSpec, RunContext, RunFn, Spec, SpecCore, SpecExtra, UpdateFn } from "./types";

type SpecCoreKeys = keyof SpecCore;
type SpecNonCore = Omit<PartialSpec, SpecCoreKeys>;
export const isSpec = (s: object): s is Spec => "run" in s && "Id" in s;
export const spec =
  <const Proto extends Dict>(proto = {} as Proto & SpecNonCore & Dict<never, Extract<keyof Proto, SpecCoreKeys>>) =>
  <
    Lo extends Load = __,
    Ctx extends RunContext | Load$Ctx<Lo, RunContext> = {},
    Update extends UpdateFn<Lo, Fn$O<Ctx, Ctx & RunContext>> = __,
  >(
    load = __ as Lo,
    ctx = {} as Ctx,
    update = __ as Update,
  ) =>
  <Params, Result, const RunExtra extends SpecExtra>(
    run: RunFn<Params, Result, Lo, Fn$O<Ctx, Ctx & RunContext>>,
    runExtra = {} as RunExtra & SpecNonCore & Dict<never, Extract<keyof RunExtra, SpecCoreKeys>>,
  ) =>
  <const Id extends Proto & RunExtra extends { Id: string } ? [string?] : [string]>(...[Id]: Id) =>
    ({
      ...proto,
      ...runExtra,
      Id: Id || runExtra["Id"] || proto["Id"] || "",
      load,
      ctx,
      update,
      run,
    }) as never as Certain<
      {
        Id: FirstMatch<[Id[0], RunExtra["Id"], Proto["Id"]], string, never>;
        load: Lo;
        ctx: Ctx;
        run: RunFn<Params, Result, Lo, Ctx extends Fn ? Fn$O<Ctx> : Ctx>;
        update: Update;
      } & Omit<Merge<RunExtra, Proto>, "Id" | SpecCoreKeys>
    >; // TODO if needed try to pack it in a type (but exactness is more important)

type Certain<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

type Merge<A, B> = Certain<A> & Omit<Certain<B>, keyof Certain<A>>;

export default spec;
