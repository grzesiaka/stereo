import { AbortSignal, ARR, id } from "jsyoyo";
import { indexify } from "proyij";
import { Task, TaskAny } from "./task";

export const NEVER = new Promise(id);
export const tick = (n = 1): Promise<void> => (n <= 1 ? Promise.resolve() : tick(n - 1).then(() => Promise.resolve()));

export const fakeAbort = new Proxy({} as any, { get: () => () => 1 }) as AbortSignal;

export type Tasks = ARR<TaskAny>;
export type Tasks$Obj<TT extends Tasks> = TT extends readonly [infer T extends Task, ...infer R extends Tasks]
  ? { [k in T["Id"]]: T } & Tasks$Obj<R>
  : {};
export const tasks$obj = indexify("Id") as <TT extends Tasks>(tt: TT) => Tasks$Obj<TT>;

export const trunc = (n: number) => Math.trunc(n * 100) / 100;
