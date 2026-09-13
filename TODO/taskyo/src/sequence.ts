import { __, AbortController, ARR, ARR1, CtxId$Id, CtxIdRequired } from "jsyoyo";
import { Task$Params, Task$ResultOK, TaskAny, DepsC, task, run, Task$, Task, Task$Error, TaskRun } from "./task";
import { ProgressBase, ProgressUpdate } from "./progress";
import { Simplify } from "type-fest";
import { AwaiTreed } from "treeo";

type TaskStep<
  T extends TaskAny = TaskAny,
  Dynamic = any,
  Static = any,
  ResultPath extends __<string> = __<string>,
> = readonly [task: T, params: TaskStepParams<T, Dynamic, Static>, result_path?: ResultPath];
type TaskStep0<T extends TaskAny = TaskAny, ResultPath extends __<string> = __<string>> = readonly [
  task: T,
  __,
  result_path?: ResultPath,
];
type TaskStepParams<T extends TaskAny = TaskAny, Dynamic = any, Static = any> = (
  d: Dynamic,
  s: Static,
) => Task$Params<T>;

type RecoveryStep<
  T extends TaskAny = TaskAny,
  Exception = any,
  Dynamic = any,
  Static = any,
  ResultPath extends __<string> = __<string>,
> = readonly [task: T, params: RecoveryStepParams<T, Exception, Dynamic, Static>, result_path: __<ResultPath>, "_"];
type RecoveryStepParams<T extends TaskAny = TaskAny, Exception = any, Dynamic = any, Static = any> = (
  e: Exception,
  s: Static,
  d: Dynamic,
) => Task$Params<T>;

type Step = TaskStep0 | TaskStep | RecoveryStep;
type Steps = ARR<Step>;
type Step$Path<ID extends string, Path extends __<string>> = Path extends string ? Path : ID;

type TaskStep$Dynamic<S> =
  S extends TaskStep<infer T, any, any, infer P>
    ? { [k in Step$Path<T["Id"], P>]: Task$ResultOK<T> }
    : S extends TaskStep0<infer T, infer P>
      ? { [k in Step$Path<T["Id"], P>]: Task$ResultOK<T> }
      : never;

type RecoveryStep$Dynamic<S> =
  S extends RecoveryStep<infer T, any, any, any, infer P> ? { [k in Step$Path<T["Id"], P>]: Task$ResultOK<T> } : never;

type _Steps$Dynamic<SS, ALL> = SS extends readonly [...infer R, infer S extends Step]
  ? S[3] extends "_"
    ? RecoveryStep$Dynamic<S> & Partial<_Steps$Dynamic<R, ALL>> // TODO: This could be bit more precise: the initial chunk till first Error present could be non-partial
    : TaskStep$Dynamic<S> & _Steps$Dynamic<R, ALL>
  : {};
type Steps$Dynamic<SS> = Simplify<_Steps$Dynamic<SS, SS>>;

type Steps$Errors<SS> = SS extends readonly [...infer R, infer S extends Step]
  ? S extends RecoveryStep
    ? Task$Error<S>
    : Task$Error<S[0]> | Steps$Errors<R>
  : never;

type Steps$InitParams<SS> = SS extends readonly [infer S, ...infer R]
  ? S extends TaskStep0<infer T>
    ? Task$Params<T>
    : Steps$InitParams<R>
  : never;

interface SeqProgress<SS extends Steps> extends ProgressBase {
  partial: Partial<Steps$Dynamic<SS>>;
}

class Seq<const SS extends ARR1<Step>, Deps extends DepsC = __> {
  constructor(
    public readonly L: () => Deps,
    public readonly R: SS,
  ) {}

  $<T extends TaskAny, const Re extends Task$Params<T>, P extends __<string> = __>(
    task: T,
    params: (R: Steps$Dynamic<SS>, L: AwaiTreed<Deps>) => Re,
    path = __ as P,
  ) {
    return new Seq(this.L, [...this.R, [task, params, path]]);
  }

  _<T extends TaskAny, const Re extends Task$Params<T>, P extends __<string> = __>(
    task: T,
    params: (ERR: Steps$Errors<SS>, L: AwaiTreed<Deps>, R: Partial<Steps$Dynamic<SS>>) => Re,
    path = __ as P,
  ) {
    return new Seq(this.L, [...this.R, [task, params, path, "_"]]);
  }

  asTask<Ctx extends CtxIdRequired>(ctx: Ctx) {
    return asTask(this.L, this.R)(ctx);
  }
}

export const sequence = <T extends TaskAny, D extends DepsC = __, P extends __<string> = __>(
  t: T,
  d = () => __ as D,
  p = __ as P,
) => new Seq(d, [[t, p] as TaskStep0<T, P>]);

const runSequence =
  <SS extends Steps>(R: SS) =>
  async (p: Steps$InitParams<SS>, L: any, a: (f: () => void) => void, u: ProgressUpdate<any>) => {
    const abort = new AbortController();
    a(() => abort.abort());
    let i = 0;
    let err = null;
    while (i < R.length) {
      const s = R[i]!;
      if (!err && s[3] === "_") continue; // regularly skip recovery steps

      const x: TaskRun<any> = run(s[0])(
        i === 0 ? p : err ? (s[1] as any)(err, L, u().partial) : (s[1] as any)(u().partial, L),
        abort.signal,
      );

      err = null;

      const progress = (re?: any) => (x: any) => {
        const t = u();
        if (re) {
          const n = t.curr + 1;
          u(n, {
            _01: n === t.total ? 1 : (i + 1) / t.total,
            partial: {
              ...t.partial,
              [s[2] || s[0]["Id"]]: re,
            },
          });
        } else {
          x.curr !== x.total && // no update in such a case - next will comes update with result
            u(t.curr, {
              _01: (i + x.curr / x.total) / t.total,
            });
        }
      };
      const d = x.progress(progress(), 1);
      const re = await x;

      d();
      if (re instanceof Error) {
        while (i < R.length) {
          if (R[i]![3] !== "_") i++;
          else break;
        }
        if (i === R.length) {
          // no recovery - error reported as such
          return re;
        }
        err = re;
      } else {
        progress(re)(x.progress());
        i++;
      }
    }

    return u().partial as TaskStep$Dynamic<SS>;
  };

export const asTask = <SS extends Steps, Deps extends DepsC>(L: () => Deps, R: SS) =>
  task({
    _01: 0,
    partial: {} as Partial<TaskStep$Dynamic<SS>>,
    total: R.length,
  })(L, { __: ["~>", R] })(runSequence(R)) as <Ctx extends CtxIdRequired>(
    ctx: Ctx,
  ) => Task$<
    { __: ["~>", SS] } & (Ctx extends string ? {} : Ctx),
    Task<CtxId$Id<Ctx>, Promise<Steps$Dynamic<SS> | Steps$Errors<SS>>, Steps$InitParams<SS>, Deps, [SeqProgress<SS>]>
  >;
