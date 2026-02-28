import { a, Fn$O, u } from "../0";
import { Cb, yR, yR2R, yR2X } from "./0";

export const UP =
  <const X extends {}, P extends yR>($: (p: yR2R<P>) => X) =>
  (P: P) =>
  (x: Cb<yR2X<P>>) =>
    u(P(x), $);
export type Upgrade<X extends {}, P extends yR> = Fn$O<typeof UP<X, P>>;

export const AD =
  <const X extends {}, P extends yR>($: X): Upgrade<X, P> =>
  (P: P) =>
  (x: Cb<yR2X<P>>) =>
    a(P(x), $);

export const ID = <ID extends PropertyKey, P extends yR, K extends PropertyKey = "id">(
  i: ID,
  k = "id" as K,
): Upgrade<{ [k in K]: ID }, P> => AD({ [k]: i });

export const YD = <YD extends PropertyKey, P extends yR>(i: YD) => ID(i, "yd") as Upgrade<{ yd: YD }, P>;
