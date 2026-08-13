import { sum } from "./sum";

export const add = <A extends number, B extends number>(a: A, b: B) => (a + b) as any as ReturnType<typeof sum<[A, B]>>;

export default add;
