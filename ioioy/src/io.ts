import { __, Cb, Fn, Dispose, ARR } from "~js";
import CTX, { type CtxIdConstraint } from "~js/ctxid";

/**
 * IO - a process
 *
 * Consumes `I`s and (potentially) asynchronously produces `O`s.
 * There is a special `.X` property that can be read synchronously and may provide additional information about process internal state.
 * `Ctx` is extra description of the process, and is present on both `.I` and `.O`. If `Ctx` is a PropertyKey it will be present as `{ Id: Ctx }`.
 */
export type IO<I = any, O = any, X = any, Ctx extends CtxIdConstraint = CtxIdConstraint> = {
  I: IN<I, Ctx>;
  O: OUT<O, Ctx, X>;
  readonly X: X; // as observed from outside
};

export type IN<I, Ctx extends CtxIdConstraint> = Fn<[I], I> & CTX<Ctx>;
export type OUT<O, Ctx extends CtxIdConstraint, X> = Fn<[], X> & Fn<[Cb<O>], Dispose> & CTX<Ctx>;

export type IdIO = IO & { I: { Id: string }; O: { Id: string } };

export type IO$I<io> = io extends IO<infer X> ? X : never;
export type IO$O<io> = io extends IO<any, infer X> ? X : never;
export type IO$X<io> = io extends IO<any, any, infer X> ? X : never;
export type IO$Ctx<io> = io extends IO<any, any, any, infer X> ? X : never;
export type IO$Id<io> = io extends { readonly I: { readonly Id: infer Id } } ? Id : never;

export type IdIOs = ARR<IdIO>;
export type IOs = ARR<IO>;

export type IO_FlatTypes<IO> = { I: IO$I<IO>; O: IO$O<IO>; X: IO$X<IO>; Id: IO$Id<IO>; IO: IO };
export type IOs$FlatTypes<IOs> = IOs extends readonly [infer H, ...infer R]
  ? [IO_FlatTypes<H>, ...IOs$FlatTypes<R>]
  : [];
