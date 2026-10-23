import { Run, run as runT, Spec, Spec$ERR, Spec$Params, CriticalError } from "taskyo";

import { $$, __, a, AbortController, DISPOSE, Fn$O, ifError } from "jsyoyo";
import { OP, $OP, Yo, oYo, closestCompletable, makeCompletable, ClosestCompletable, Completable } from "../base/yo";
import { Concurrency } from "../base";
import { mutatingRemove } from "arryo";

export type TaskCtx<Z> = (__ extends Z ? {} : { Z: Z }) & {
  idx: number;
  pending: unknown[];
  running: (Run | Promise<Run>)[];
  [DISPOSE]: () => void;
};

export type Task<TaskSpec extends Spec, Prev extends Yo, Con extends Concurrency> = OP<
  Spec,
  Prev,
  TaskCtx<
    Completable<
      | (ClosestCompletable<Prev> extends __ ? never : $$<ClosestCompletable<Prev>["Z"]["X"]>)
      | Spec$ERR<Spec>
      | CriticalError // Exposing CriticalError is not ideal, but by definition it cannot be reflected in the types. TODO: figure out if and how should it be controlled: an option or an operator (aka filter) or a phantom operator
    >
  >,
  "task",
  [TaskSpec, Con]
>;
export type Task$<TaskSpec extends Spec, Prev extends oYo, Con extends Concurrency> = $OP<
  Task<TaskSpec, Fn$O<Prev>, Con>
>;
export type TaskOp = <TaskSpec extends Spec, Prev extends oYo<Spec$Params<TaskSpec>>, Con extends Concurrency>(
  spec: Spec,
  concurrency?: Con,
) => (Y: Prev) => Task$<TaskSpec, Prev, Con>;

export const task = Yo<"task", [Spec, Concurrency?]>("task")((_, P, params) => {
  const abort = new AbortController();
  const canRun = () => $.running.length < (params[1] || Infinity);
  const run1 = (r: Run) => {
    $.running.push(r);
    r.promise
      .then((v) => {
        mutatingRemove(r)($.running);
        ifError(v, completeSelf, (v) => {
          $.o(v);
          handlePrevComplete?.();
        });
        nextPending();
      })
      .catch((err) => completeSelf(err));
  };
  const run = (x: unknown) => {
    const r = runT(params[0])(x, abort.signal);
    if (r instanceof Promise) {
      $.running.push(r);
      r.then((x) => {
        mutatingRemove(r)($.running);
        run1(x);
      });
    } else {
      run1(r);
    }
  };

  const nextPending = () => {
    if ($.pending.length) {
      if (canRun()) {
        run($.pending.shift());
      }
    } else {
      handlePrevComplete?.();
    }
  };

  const onNext = (x: unknown) => {
    if (canRun()) {
      run(x);
    } else {
      $.pending.push(x);
    }
  };

  const $ = a(_, {
    idx: 0,
    pending: [] as unknown[],
    running: [] as (Run | Promise<Run>)[],
    [DISPOSE]: () => abort.abort(),
  } satisfies TaskCtx<any>);

  $.Y = P((x) => $.pending.push(x)); // gymnastic around sync emissions

  let handlePrevComplete: __<() => void>;
  const Z = closestCompletable($.Y);
  const [completeSelf] = makeCompletable($, $[DISPOSE]);
  if (Z) {
    handlePrevComplete = () => {
      if (!$.running.length && Z.Z.X !== __) {
        completeSelf(Z.Z.X);
      }
    };
  }
  $.Y.o = onNext;
  while ($.pending.length && canRun()) {
    nextPending();
  }
}) as never as TaskOp;
