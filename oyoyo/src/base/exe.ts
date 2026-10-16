import { __, DISPOSE } from "jsyoyo";
import { oYo, Yo, YoY } from "./yo";

export type Flatten<Y> = Y extends { Y: infer y } ? [...Flatten<y>, Y] : Y extends __ ? [] : [Y];
export const flatten = <Y extends YoY>(Y: Y) => {
  const r = [];
  let y = Y as Yo;
  while (y) {
    y !== __ && r.unshift(y);
    y = y.Y;
  }
  return r as Flatten<Y>;
};

export const dispose = <YY extends YoY>(YY: YY) => flatten(YY).forEach((y) => DISPOSE in y && y[DISPOSE]());

export const exe =
  <R, Y extends oYo>() =>
  (Y: Y) => {};
