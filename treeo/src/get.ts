import { Get } from "type-fest";

export type { Get };

// TODO improve: add cache
export const get = (op: string, x: object) => {
  const parts = op.split(".");
  let i = x as any;
  for (const p of parts) {
    i = i[p];
  }
  return i;
};
