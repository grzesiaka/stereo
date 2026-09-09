import { __, ARR, Dict, Fn$O } from "jsyoyo";
import { SimplifyDeep, Simplify } from "type-fest";
import { Spec$Params, Spec$Result, TaskSpecAny, TaskSpec } from "./task";
import { indexify, Indexify } from "proyij";

type Step<L = unknown, R = unknown, E extends ARR = ARR> = readonly [L, R, ...E];

type _Params<Specs extends Dict<TaskSpec>> = { [K in keyof Specs]: Spec$Params<Specs[K]> };
type Specs$Params<Specs extends Dict<TaskSpec>, Ctx> = _Params<Specs> | ((ctx: Ctx) => _Params<Specs>);

type _Steps$Accumulated<Steps> = Steps extends readonly [infer H, ...infer R]
  ? _Steps$Accumulated<R> & (H extends Step<infer ID extends string, infer X> ? { [i in ID]: Fn$O<X> } : {})
  : {};
type Steps$Accumulated<Steps> = Simplify<_Steps$Accumulated<Steps>>;

export class Taskyo<
  Ctx = __,
  Specs extends Dict<TaskSpecAny> = Dict<TaskSpecAny>,
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

  $<ID extends string, const Next>(ID: ID, $: (ctx: Ctx, acc: Steps$Accumulated<Steps>, t: this) => Next) {
    return new Taskyo<Next, Specs, [] extends Steps ? [[ID, Next]] : [...Steps, [ID, Next]]>(
      this.specs,
      this.steps.concat([ID, $]) as never,
    );
  }
}

export const taskyo = <
  Specs extends Dict<TaskSpecAny> | ARR<TaskSpecAny>,
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

/*
  TODO for 2026-09-09

    1. taskyo - context, provide results from previous steps
    1. taskyo - adding steps, TODO steps
*/
