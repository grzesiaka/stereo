import { __, Cb, DISPOSE, Fn$O, id } from "jsyoyo";
import { ClosestCompletable, closestCompletable, observeCompleted, oYo, oYo$X, Yo } from "./yo";

export type Flatten<Y> = Y extends { Y: infer y } ? [...Flatten<y>, Y] : Y extends __ ? [] : [Y];
export const flatten = <Y extends Partial<Yo>>(Y: Y) => {
  const r = [];
  let y = Y as Yo;
  while (y) {
    y !== __ && r.unshift(y);
    y = y.Y;
  }
  return r as Flatten<Y>;
};

export const dispose = <Y extends Partial<Yo>>(Y: Y, flat = flatten(Y)) =>
  flat.forEach((y) => DISPOSE in y && y[DISPOSE]());

export type ExecutePipeline<Y extends oYo> = {
  flat: Flatten<Fn$O<Y>>;
  Y0: Flatten<Fn$O<Y>>[0];
  Y: Fn$O<Y>;
  I: Flatten<Fn$O<Y>>[0] extends { I: infer I } ? I : __;
  Z: ClosestCompletable<Fn$O<Y>>;
  [DISPOSE]: () => void;
};

export const exe =
  <Y extends oYo>(onNext = id as (x: Cb<oYo$X<Y>>) => void, onCompleted?: () => void) =>
  (Yo: Y) => {
    const Y = Yo(onNext);
    const flat = flatten(Y);
    const dispose_ = () => dispose(Y, flat);
    onCompleted && observeCompleted(Y, onCompleted);
    return {
      Y0: flat[0],
      Y: flat[flat.length - 1],
      flat,
      I: flat[0].I,
      Z: closestCompletable(Y),
      [DISPOSE]: dispose_,
    } as ExecutePipeline<Y>;
  };
