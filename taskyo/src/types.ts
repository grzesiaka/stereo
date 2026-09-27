// // import { Simplify } from "type-fest";
// import type { __, ARR, Json, MsOrNumber } from "jsyoyo";

// import type { Tree, Dethunk, AwaiTreed } from "treeo";
// // import { RetryRun } from "./run";

// export type ErrorLike = Error | { $: Error };
// export type ErrorLikes = ARR<ErrorLike>;

// export interface RunState {
//   curr?: number;
//   total?: number;
// }
// export type Load$State<Lo extends Load, State extends RunState> = (deps: Load$Deps<Lo>) => State;
// export type UpdateFn<Lo extends Load, State extends RunState> = __ | ((state: State, deps: Load$Deps<Lo>) => void);

// export type StateRunFn<State extends RunState> = (u?: Partial<State>) => State;

// export type RunFn<Params, Result, Lo extends Load, State extends RunState> = (
//   params: Params,
//   deps: Load$Deps<Lo>,
//   state: StateRunFn<State>,
//   onabort: (dispose: () => void) => void,
//   spec: LoadedSpec<SpecCore<Params, Result, Lo, State>>,
// ) => Result | readonly [Result, () => void];

// export type RetryOptions<
//   Id extends string = string,
//   Params = any,
//   Result = any,
//   Lo extends __<Load> = any,
//   State extends RunState = any,
// > = (
//   error: Extract<Awaited<Result>, Error>,
//   deps: Spec$Deps<Lo>,
//   self: SpecAny<Id, Params, Result, Lo, State>,
// ) => Promise<any>;

// export type CacheOptions<Params, Lo extends __<Load>> = {
//   key: (p: Params, deps: Load$Deps<Lo>) => string;
// };
// export interface SpecExtra<
//   Id extends string = string,
//   Params = any,
//   Result = any,
//   Lo extends __<Load> = any,
//   State extends RunState = any,
// > {
//   Id?: string;
//   // max time of execution
//   timeout?: MsOrNumber;
//   // expected time of execution
//   ms?: MsOrNumber;
//   cache?: CacheOptions<Params, Lo>;
//   retry?: RetryOptions<Id, Params, Result, Lo, State>;
// }

// export interface SpecCore<
//   Params = unknown,
//   Result = unknown,
//   Lo extends __<Load> = __,
//   State extends RunState = RunState,
// > {
//   Id: string;
//   load?: Lo;
//   state: State | Load$State<Lo, State>;
//   update?: UpdateFn<Lo, State>;
//   run: RunFn<Params, Result, Lo, State>;
// }

// // export type Spec<
// //   Id extends string = string,
// //   Params = unknown,
// //   Result = unknown,
// //   Lo extends __<Load> = __,
// //   State extends RunState = {},
// //   Extra extends SpecExtra<Id, Params, Result, Lo, State> = SpecExtra<Id, Params, Result, Lo, State>,
// // > = Simplify<{ Id: Id } & SpecCore<Params, Result, Lo, State> & Extra>;

// // export type LoadSpec<S extends SpecAny> = LoadedSpec<
// //   S["Id"],
// //   Spec$Params<S>,
// //   Spec$Result<S>,
// //   Spec$Deps<S>,
// //   Spec$State<S>
// // > &
// //   S;

// export interface SpecAny<
//   Id extends string = string,
//   Params = any,
//   Result = any,
//   Lo extends __<Load> = any,
//   State extends RunState = any,
// > extends SpecCore<Params, Result, Lo, State> {
//   Id: Id;
// }

// // export type PartialSpec<
// //   Id extends string = string,
// //   Params = any,
// //   Result = any,
// //   Lo extends __<Load> = any,
// //   State extends RunState = any,
// // > = Partial<Spec<Id, Params, Result, Lo, State>>;

// export type Spec$Params<S> = S extends SpecAny<string, infer X> ? X : never;
// export type Spec$Result<S> = S extends SpecAny<string, any, infer X> ? X : never;
// export type Spec$Deps<S> = S extends SpecAny<string, any, any, infer X> ? X : never;
// export type Spec$State<S> = S extends SpecAny<string, any, any, any, infer X> ? X : never;

// export type Spec$OK<S> = Exclude<Awaited<Spec$Result<S>>, Error>;
// export type Spec$ERR<S> = Extract<Awaited<Spec$Result<S>>, Error>;
