// oxlint-disable no-undef
// oxlint-disable-next-line typescript/triple-slash-reference
/// <reference path="../node_modules/@types/web/index.d.ts" preserve="true" />

import { ARR } from "~types";
export * from "./env/web/main";
export * as Win from "./env/web/main";

export let Console = console;

type LogReturn<X extends ARR> = X extends { length: 0 | 1 } ? X[0] : X[1];

export let Log = <const X extends ARR>(...x: X): LogReturn<X> => (console.log(...x), x.length <= 1 ? x[0] : x[1]);
export let Warn = <const X extends ARR>(...x: X): LogReturn<X> => (console.warn(...x), x.length <= 1 ? x[0] : x[1]);
export let Err = <const X extends ARR>(...x: X): LogReturn<X> => (console.error(...x), x.length <= 1 ? x[0] : x[1]);

export let Doc = document;
export let Ele = document.createElement.bind(document);

export let Timeout = <Ms extends number>(ms: Ms, cb: (x?: unknown) => void) => {
  const t = setTimeout(cb, ms);
  return () => clearTimeout(t);
};

export let Wait = <Ms extends number>(ms: Ms) => new Promise((res) => Timeout(ms, res));

export let Interval = <Ms extends number>(ms: Ms, cb: () => void) => {
  const t = setInterval(cb, ms);
  return () => clearInterval(t);
};

export let Now = () => performance.now();

type Task<Name extends string | undefined = undefined, X = unknown, Params extends ARR = ARR> = Name extends string
  ? [name: Name, task: (...ps: Params) => Promise<X>, ...Params]
  : [task: (...ps: Params) => Promise<X>, ...Params];

export let Task = <X, Params extends ARR = [], Name extends string | undefined = undefined>(
  ...taskParams: Task<Name, X, Params>
) => {
  if (typeof taskParams[0] !== "string") taskParams.unshift(taskParams[0].toString());
  const [n, task, ...params] = taskParams as Task<string>;
  const start = Now();
  Log(`[TASK_STARTED] ${n}`, { params, task });
  return task(...params)
    .then((x) => (Log(`[TASK_OK] ${n}`, Math.round(Now() - start), x, { params, task }), x))
    .catch((x) => (Err(`[TASK_ERROR] ${n}`, Math.round(Now() - start), x, { params, task }), x));
};
