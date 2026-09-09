import { ARR } from "jsyoyo";
import { Tree } from "treeo";
import { Simplify } from "type-fest";
import { o, Compose } from "composyo";

import { Spec$Params, Spec$ResultOK, TaskSpec, TaskSpecAny } from "./task";

export type STEP1<
  Ctx = unknown,
  S extends TaskSpecAny = TaskSpecAny,
  Params extends (ctx: Ctx) => Spec$Params<S> = (ctx: Ctx) => Spec$Params<S>,
> = [S, Params];

export type STEP<Ctx = unknown> = STEP1<Ctx> | Tree<STEP1<Ctx>> | ARR<STEP1<Ctx>>;

export type STEPS = ARR<STEP>;

type S$R<S, Flat = false> = S extends readonly [readonly [TaskSpecAny, ...any[]], ...infer R]
  ? S$R<S[0]> & ([] extends R ? {} : S$R<R>)
  : S extends readonly [infer S extends TaskSpecAny, ...any[]]
    ? true extends Flat
      ? Spec$ResultOK<S>
      : { [K in S["ID"]]: Spec$ResultOK<S> }
    : S extends { [K in string]: any }
      ? { [K in keyof S]: Simplify<S$R<S[K], true>> }
      : never;
export type Step$Result<S> = Simplify<S$R<S>>;

type SPEC<ID extends string, Params = ID, Result = ID> = [TaskSpec<ID, Result, Params>, () => Params, ID];

type A = Step$Result<[SPEC<"A", "", "AA">, SPEC<"B">]>;

type B = Step$Result<{ A: { B: SPEC<"AB", 1, Promise<2>>; C: { D: [SPEC<"L">, SPEC<"R">] } } }>;

export class Taskyo<Steps extends STEPS> {
  constructor(public readonly steps: Steps) {}
  run<S extends STEP>() {}
}
