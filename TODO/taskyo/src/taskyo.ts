import { __, ARR, Dict } from "jsyoyo";
import { SimplifyDeep } from "type-fest";
import { Spec$Params, Spec$Result, TaskSpacAny, TaskSpec } from "./task";
import { indexify, Indexify } from "proyij";

type Step<ID extends string = string, X = unknown> = readonly [ID, X];

type _Params<Specs extends Dict<TaskSpec>> = { [K in keyof Specs]: Spec$Params<Specs[K]> };
type Specs$Params<Specs extends Dict<TaskSpec>, Ctx> = _Params<Specs> | ((ctx: Ctx) => _Params<Specs>);

export class Taskyo<
  Ctx = __,
  Specs extends Dict<TaskSpacAny> = Dict<TaskSpacAny>,
  Steps extends ARR<Step> = ARR<Step>,
> {
  constructor(
    public readonly specs: Specs,
    public readonly steps: Steps,
    public readonly ctx?: __<Ctx>,
  ) {}

  $params<ID extends string, const Params extends Specs$Params<Specs, Ctx>>(ID: ID, $: Params) {
    return new Taskyo<
      SimplifyDeep<Ctx & { [i in ID]: { [k in keyof Params & keyof Specs]: Spec$Result<Specs[k]> } }>,
      Specs,
      [...Steps, [ID, Params]]
    >(this.specs, this.steps.concat([ID, $]) as [...Steps, [ID, Params]]);
  }

  $<ID extends string, const Next>(ID: ID, $: (ctx: Ctx, t: this) => Next) {
    return new Taskyo<Next, Specs, [] extends Steps ? [[ID, Next]] : [...Steps, [ID, Next]]>(
      this.specs,
      this.steps.concat([ID, $]) as never,
    );
  }
}

export const taskyo = <
  Specs extends Dict<TaskSpacAny> | ARR<TaskSpacAny>,
  const Steps extends ARR<Step> = [],
  const Ctx = {},
>(
  specs: Specs,
  steps = [] as never as Steps,
  ctx = {} as Ctx,
) =>
  new Taskyo<Ctx, Specs extends ARR ? Indexify<Specs, "ID"> : Specs, Steps>(
    (Array.isArray(specs) ? indexify("ID")(specs) : specs) as never,
    steps,
    ctx,
  );

export default taskyo;
