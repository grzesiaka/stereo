import { __, Cb, Fn, Dispose, ARR } from "~js";
import CTX from "~js/ctxid";

export type IO<I = any, O = any, X = any, Ctx = any> = {
  I: IN<I, Ctx, X>;
  O: OUT<O, Ctx, X>;
};

export type IN<I, Ctx, X = I> = Fn<[I], I> & CTX<Ctx, { readonly V: X }>;
export type OUT<O, Ctx, X = O> = Fn<[], X> & Fn<[Cb<O>], Dispose> & CTX<Ctx>;

export type IdIO = IO & { I: { Id: string }; O: { Id: string } };

export type IO$I<io> = io extends IO<infer X> ? X : never;
export type IO$O<io> = io extends IO<any, infer X> ? X : never;
export type IO$X<io> = io extends IO<any, any, infer X> ? X : never;
export type IO$Ctx<io> = io extends IO<any, any, any, infer X> ? X : never;
export type IO$Id<io> = io extends { readonly I: { readonly Id: infer Id } } ? Id : never;

export type IdIOs = ARR<IdIO>;
export type IOs = ARR<IO>;

export type IO_FlatTypes<IO> = { I: IO$I<IO>; O: IO$O<IO>; X: IO$X<IO>; Id: IO$Id<IO> };
export type IOs$FlatTypes<IOs> = IOs extends readonly [infer H, ...infer R]
  ? [IO_FlatTypes<H>, ...IOs$FlatTypes<R>]
  : [];
