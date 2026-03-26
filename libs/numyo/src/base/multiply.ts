import { product } from "./product";

export const multiple = <A extends number, B extends number>(a: A, b: B) =>
  (a * b) as any as ReturnType<typeof product<[A, B]>>;

export default multiple;
