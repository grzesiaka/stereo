import { dethunk } from "./fun";

export const THROW = (x?: unknown) => {
  throw dethunk(x) || new Error("THROW");
};
THROW.$ = (x?: unknown) => () => THROW(x);

export default THROW;
