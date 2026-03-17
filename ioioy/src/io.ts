import type { IsEqual, Simplify } from "type-fest";
import { __, a, Cb, Fn, Dispose } from "~js";

type CTX<L, E = {}> = Simplify<E & (L extends string ? { Id: L } : __ extends L ? {} : L)>;
export const ctx = <X extends {}, L, E>(x: X, L: L, E?: E) => a(x, typeof L === "string" ? { Id: L } : L, E);

export type IN_CTX_X<I, Ctx, X = I> = Fn<[I], I> & CTX<Ctx, { V: X }>;
export type OUT_CTX_X<O, Ctx, X = O> = Fn<[], X> & Fn<[Cb<O>], Dispose> & CTX<Ctx>;

export type IN_X<I, X = I> = IN_CTX_X<I, __, X>;
export type OUT_X<O, X = O> = OUT_CTX_X<O, __, X>;

export type IN<I, Ctx> = IN_CTX_X<I, Ctx, I>;
export type OUT<O, Ctx> = OUT_CTX_X<O, Ctx, O>;

export type IN_<I> = IN<I, __>;
export type OUT_<O> = OUT<O, __>;

export type IO<I = any, O = any, X = any, Ctx = unknown, E = {}> = Simplify<
  E & {
    I: __ extends Ctx
      ? IsEqual<I, X> extends true
        ? IN_<I>
        : IN_X<I, X>
      : IsEqual<I, X> extends true
        ? IN<I, Ctx>
        : IN_CTX_X<I, Ctx, X>;
    O: __ extends Ctx
      ? IsEqual<O, X> extends true
        ? OUT_<O>
        : OUT_X<O, X>
      : IsEqual<O, X> extends true
        ? OUT<X, Ctx>
        : OUT_CTX_X<O, Ctx, X>;
  }
>;

export type IO$I<io> = io extends IO<infer X> ? X : never;
export type IO$O<io> = io extends IO<any, infer X> ? X : never;
export type IO$X<io> = io extends IO<any, any, infer X> ? X : never;
