// import type { ARR } from "~js";
// import type { Tagged } from "type-fest";

// type Percent = Tagged<number, "%", "[0,1] - a value between 0 and 1 inclusive">;

// type ProgressUpdate<X = unknown> = [percent0to1: number] | [percent0to1: number, progressInfo: X];
// export interface Progressable<Update extends ProgressUpdate = [number], Extra extends ARR = []> {
//   "%": number;
//   onprogress: (...args: [...Update]) => void;
// }

// type TaskExeState = "pending" | "done" | "aborted" | "errored";

// interface TaskExe<Update = unknown, Output = unknown> extends Promise<Output> {}

// type Task<I extends [any?], O, U, E> = (...i: I) => O;

// interface TaskSpec {}
