import { __, Dict, FirstMatch } from "jsyoyo";

import type { Load, Load$Ctx, PartialSpec, RunContext, RunFn, Spec, SpecExtra, UpdateFn } from "./types";

type SpecCoreKeys = "load" | "ctx" | "update" | "run";
type SpecNonCore = PartialSpec & { [k in SpecCoreKeys]?: never } & Dict;

export const spec =
  <const Proto extends SpecNonCore>(proto = {} as Proto) =>
  <Lo extends Load = __, Ctx extends RunContext = RunContext>(
    load = __ as Lo,
    ctx = {} as Ctx as Ctx | Load$Ctx<Lo, Ctx>,
    update = __ as UpdateFn<Lo, Ctx>,
  ) =>
  <Params, Result, const RunExtra extends SpecExtra>(
    run: RunFn<Params, Result, Lo, Ctx>,
    runExtra = {} as SpecNonCore,
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
    }) satisfies Spec as never as Spec<
      FirstMatch<[Id[0], RunExtra["Id"], Proto["Id"]], string, never>,
      Params,
      Result,
      Lo,
      Ctx
    > &
      Omit<Merge<RunExtra, Proto>, "Id" | SpecCoreKeys>;

type Certain<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

type Merge<A, B> = Certain<A> & Omit<Certain<B>, keyof Certain<A>>;

export default spec;
