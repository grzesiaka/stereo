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
  <Y extends oYo, R = () => void>(
    fn?: (dispose: () => void, flat: Flatten<Fn$O<Y>>) => R,
    o = id as (x: Cb<oYo$X<Y>>) => void,
  ) =>
  (Y: Y): R => {
    const y = Y(o);
    const flat = flatten(y);
    const dis = () => dispose(y, flat);
    // @ts-expect-error `flat` problem with flat
    return fn ? fn(dis, flat) : dis;
  };
