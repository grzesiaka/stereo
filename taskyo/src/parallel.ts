import { __, AbortController, ARR, deferred, disposyo, MsOrNumber } from "jsyoyo";
import { RunFn, Spec, spec, Spec$ERR, Spec$OK, Spec$Params, SpecCore, SpecOptions } from "./spec";
import { run, Spec$Run } from "./run";
import { Simplify } from "type-fest";
import { critical } from "./errors";

export type Specs$ParallelState<S extends ARR> = {
  curr: number;
  total: S["length"];
  runs: Partial<Simplify<_Specs$Run<S>>>;
};
type _Specs$Run<Ss extends ARR> = Ss extends readonly [
  infer S extends { Id: string; run: RunFn<any, any, any, any> },
  ...infer R,
]
  ? { [k in S["Id"]]: Spec$Run<S> } & _Specs$Run<R>
  : {};

export type Specs$ParallelOK<S extends ARR> = Simplify<_Specs$ParallelOK<S>>;
type _Specs$ParallelOK<Ss extends ARR> = Ss extends readonly [infer S extends { Id: string }, ...infer R]
  ? { [k in S["Id"]]: Spec$OK<S> } & _Specs$ParallelOK<R>
  : {};

export type Specs$ParallelERR<Ss extends ARR> = Ss extends readonly [infer S, ...infer R]
  ? Spec$ERR<S> | Specs$ParallelERR<R>
  : never;

export type Spec$ParallelResult<S extends ARR> = Promise<Specs$ParallelOK<S> | Specs$ParallelERR<S>>;

export type Specs$ParallelParams<S extends ARR> = Simplify<_Specs$ParallelParams<S>>;
type _Specs$ParallelParams<Ss extends ARR> = Ss extends readonly [infer S extends { Id: string }, ...infer R]
  ? { [k in S["Id"]]: Spec$Params<S> } & _Specs$ParallelParams<R>
  : {};

export const parallel = (<const Ss extends ARR<Spec>>(ss: Ss) =>
  spec.$({
    __: ["⨂", ss],
  })(__, { curr: 0, total: ss.length, runs: {} } as Specs$ParallelState<Ss>)<Specs$ParallelParams<Ss>, any>(
    async (params, _, state, abo) => {
      let dis = disposyo();
      const abort = new AbortController();
      abo(() => (dis(), abort.abort()));
      const def = deferred();
      const rs = Promise.all(
        ss.map(async (s) => {
          const r = await run(s)(params[s.Id as never]);
          (state() as any).runs[s.Id] = r;
          r.promise
            .then((x) => {
              if (x instanceof Error) {
                def.resolve(x);
              }
              state({ curr: state().curr + 1 } as never);
            })
            .catch((err) => def.reject(critical(err, r)));
          return r.promise;
        }),
      ).then((vs) => vs.reduce((a, v, i) => ((a[ss[i]!.Id] = v), a), {} as any));

      return rs.finally(dis);
    },
  )) as <const Ss extends ARR<Spec>>(
  ss: Ss,
) => <
  Options extends SpecOptions<NoInfer<Timeout>, Specs$ParallelParams<Ss>, Spec$ParallelResult<Ss>, __> = {},
  const Id extends string = "",
  const Timeout extends __<MsOrNumber> = __,
>(
  Id?: Id,
  timeout?: Timeout,
  opt?: Options,
) => Spec<
  Id,
  SpecCore<Specs$ParallelParams<Ss>, Spec$ParallelResult<Ss>, __, Specs$ParallelState<Ss>, __>,
  Options & { timeout: Timeout } & {
    __: ["⨂", Ss];
  }
>;

export default parallel;
