import { __, FirstMatch } from "jsyoyo";

import type { Load, Load$Ctx, PartialSpec, RunContext, RunFn, Spec, SpecExtra, UpdateFn } from "./types";

export const spec =
  <const Proto extends PartialSpec>(proto = {} as Proto) =>
  <Lo extends Load = __, Ctx extends RunContext = RunContext>(
    load = __ as Lo,
    ctx = {} as Ctx as Ctx | Load$Ctx<Lo, Ctx>,
    update = __ as UpdateFn<Lo, Ctx>,
  ) =>
  <Params, Result, const RunExtra extends SpecExtra>(run: RunFn<Params, Result, Lo, Ctx>, runExtra = {} as RunExtra) =>
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
      FirstMatch<[Id[0], RunExtra["Id"], Proto["Id"]], string>,
      Params,
      Result,
      Lo,
      Ctx
    >;

export default spec;
