import { Is, Is$Out, Is$In, ifFunction } from "ififify";
import { id } from "./id";

export const ASSERT =
  <P extends Is>(p: P, failed = p.name as string | ((v: Is$In<P>) => string | Error)) =>
  <X extends Is$In<P>, Ok = Is$Out<P>>(x: X, ok = id as (x: Is$Out<P>) => Ok) => {
    if (p(x)) return ok(x as Is$Out<P>);
    const e = ifFunction(failed, (f) => f(x));
    throw e instanceof Error ? e : new Error(`ASSERT: ${e}`);
  };

export const ERR = <X, Err>(x: X, err = id as (x: Extract<X, Error>) => Err) =>
  ASSERT((x): x is Extract<X, Error> => x instanceof Error, "error expected")(x, err) as Extract<X, Error>;
export const OK = <X, Ok>(x: X, ok = id as (x: Exclude<X, Error>) => Ok) =>
  ASSERT((x): x is Exclude<X, Error> => !(x instanceof Error), "non-error expected")(x, ok) as Exclude<X, Error>;

ASSERT.ERR = ERR;
ASSERT.OK = OK;
ASSERT.TAG =
  <const Key extends PropertyKey>(key: Key) =>
  <const Tag extends string>(tag: Tag) =>
    ASSERT((x): x is never => x[key] === tag, `[key] !== ${tag}`) as <X, Ok = X>(
      x: X,
      ok?: (x: X) => Ok,
    ) => Extract<X, { [k in Key]: Tag }>;
ASSERT.NAME = ASSERT.TAG("name");

export default ASSERT;
