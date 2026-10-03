import { __, AbortController, ARR } from "jsyoyo";
import { Spec, spec, Spec$Params, Spec$Result, Spec$RunState, SpecCore, SpecOptions } from "./spec";
import { run } from "./run";

export type Specs$ChoiceState<Ss extends ARR> = Ss extends readonly [infer S, ...infer R]
  ? Spec$RunState<S> | Specs$ChoiceState<R>
  : never;

export type Specs$ChoiceResult<Ss extends ARR> = Ss extends readonly [infer S, ...infer R]
  ? Spec$Result<S> | Specs$ChoiceResult<R>
  : never;

export type Specs$ChoiceParams<Ss extends ARR> = Ss extends readonly [infer S extends { Id: string }, ...infer R]
  ? [S["Id"], Spec$Params<S>] | Specs$ChoiceParams<R>
  : never;

export const choice = (<const Ss extends ARR<Spec>>(ss: Ss) =>
  spec.$({
    __: ["⨁", ss],
  })(
    __,
    {} as Specs$ChoiceState<Ss>,
  )<Specs$ChoiceParams<Ss>, any>(async (params, _, state, abo) => {
    const s = ss.find((s) => s.Id === params[0])!;
    let dis = () => 1 as unknown;
    const abort = new AbortController();
    abo(() => (dis(), abort.abort()));
    const r = await run(s, (r) => {
      state(r.state());
      dis = r.state(state);
    })(params[1], abort.signal);

    return r.promise.finally(dis);
  })) as <const Ss extends ARR<Spec>>(
  ss: Ss,
) => <Options extends SpecOptions<Specs$ChoiceParams<Ss>, Specs$ChoiceResult<Ss>, any>, const Id extends string = "">(
  Id?: Id,
  opt?: Options,
) => Spec<
  Id,
  SpecCore<Specs$ChoiceParams<Ss>, Specs$ChoiceResult<Ss>, __, Specs$ChoiceState<Ss>, __>,
  Options & {
    __: ["⨁", Ss];
  }
>;

export default choice;
