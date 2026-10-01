import { Is, Is$Out, Is$In, ifFunction } from "ififify";
import { id } from "./id";

export const ASSERT =
  <P extends Is>(p: P, failed = p.name as string | ((v: Is$In<P>) => string | Error)) =>
  <X extends Is$In<P>, Ok = Is$Out<P>>(x: X, ok = id as (x: Is$Out<P>) => Ok) => {
    if (p(x)) return ok(x as Is$Out<P>);
    const e = ifFunction(failed, (f) => f(x));
    throw e instanceof Error ? e : new Error(`ASSERT_ERROR ${e}`);
  };

export default ASSERT;
