import type { Simplify } from "type-fest";
import { __, a, Cb, Fn, Dispose, ARR } from "~js";

type CTX<L, E = {}> = Simplify<E & (L extends string ? { Id: L } : __ extends L ? {} : L)>;
export const ctx = <X extends {}, L, E>(x: X, L: L, E?: E) => a(x, typeof L === "string" ? { Id: L } : L, E);

export type IO<I = any, O = any, X = any, Ctx = any> = {
  I: IN<I, Ctx, X>;
  O: OUT<O, Ctx, X>;
};

export type IN<I, Ctx, X = I> = Fn<[I], I> & CTX<Ctx, { V: X }>;
export type OUT<O, Ctx, X = O> = Fn<[], X> & Fn<[Cb<O>], Dispose> & CTX<Ctx>;

export type IdIO = IO & { I: { Id: string }; O: { Id: string } };

export type IO$I<io> = io extends IO<infer X> ? X : never;
export type IO$O<io> = io extends IO<any, infer X> ? X : never;
export type IO$X<io> = io extends IO<any, any, infer X> ? X : never;
export type IO$Ctx<io> = io extends IO<any, any, any, infer X> ? X : never;
export type IO$Id<io> = io extends { readonly I: { readonly Id: infer Id } } ? Id : never;

export type IdIOs = ARR<IdIO>;
export type IOs = ARR<IO>;

export type IOXId<I, O, X, Id> = { I: I; O: O; X: X; Id: Id };
export type IOs$IOXIds<ios> = ios extends readonly [infer H, ...infer R]
  ? [IOXId<IO$I<H>, IO$O<H>, IO$X<H>, IO$Id<H>>, ...IOs$IOXIds<R>]
  : [];
