import { __, Cb, DISPOSE, Fn$O, id } from "jsyoyo";
import { oYo, oYo$X, Yo } from "./yo";

export type Flatten<Y> = Y extends { Y: infer y } ? [...Flatten<y>, Y] : Y extends __ ? [] : [Y];
export const flatten = <Y extends Yo>(Y: Y) => {
  const r = [];
  let y = Y as Yo;
  while (y) {
    y !== __ && r.unshift(y);
    y = y.Y;
  }
  return r as Flatten<Y>;
};

export const dispose = <Y extends Yo>(Y: Y, flat = flatten(Y)) => flat.forEach((y) => DISPOSE in y && y[DISPOSE]());

export const exe =
  <Y extends oYo>(o = id as (x: Cb<oYo$X<Y>>) => void) =>
  (Yo: Y) => {
    const Y = Yo(o);
    const flat = flatten(Y);
    const dispose_ = () => dispose(Y, flat);
    return {
      flat,
      I: flat[0].I,
      [DISPOSE]: dispose_,
      0: dispose_,
    } as {
      flat: Flatten<Fn$O<Y>>;
      I: Flatten<Fn$O<Y>>[0] extends { I: infer I } ? I : __;
      [DISPOSE]: () => void;
      0: () => void;
    };
  };
