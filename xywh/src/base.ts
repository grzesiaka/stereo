import { Sum, Product } from "numyo";

export interface Point<X extends number = number, Y extends number = number> {
  x: X;
  y: Y;
}

export const point = <X extends number, Y extends number>(x: X, y: Y) =>
  ({
    x,
    y,
  }) as Point<X, Y>;

export interface Size2D<W extends number = number, H extends number = number> {
  w: W;
  h: H;
}

export interface Rect<
  X extends number = number,
  Y extends number = number,
  W extends number = number,
  H extends number = number,
>
  extends Point<X, Y>, Size2D<W, H> {
  x: X;
  y: Y;
  w: W;
  h: H;
}

export const $rect =
  <E extends {}>(e = {} as E) =>
  <X extends number, Y extends number, W extends number, H extends number>(x: X, y: Y, w: W, h: H) =>
    ({
      ...e,
      x,
      y,
      w,
      h,
    }) as Rect<X, Y, W, H> & E;
export const rect = $rect();

export const center = <R extends Rect>(r: R) =>
  ({
    x: r.x + r.w / 2,
    y: r.y + r.h / 2,
  }) as Point<Sum<[R["x"], Product<[R["w"], 0.5]>]>, Sum<[R["y"], Product<[R["h"], 0.5]>]>>;

export const resizeBy =
  <R extends Rect>(r: R) =>
  <W extends number, H extends number>(w: W, h: H) =>
    ({
      x: r.x,
      y: r.y,
      w: r.w + w,
      h: r.h + h,
    }) as Rect<R["x"], R["y"], Sum<[R["w"], W]>, Sum<[R["h"], H]>>;

export const resizeTo =
  <R extends Rect>(r: R) =>
  <W extends number, H extends number>(w: W, h: H) =>
    ({
      x: r.x,
      y: r.y,
      w: w,
      h: h,
    }) as Rect<R["x"], R["y"], W, H>;

export const moveBy =
  <R extends Rect>(r: R) =>
  <X extends number, Y extends number>(x: X, y: Y) =>
    ({
      x: r.x + x,
      y: r.y + y,
      w: r.w,
      h: r.h,
    }) as Rect<Sum<[R["x"], X]>, Sum<[R["y"], Y]>, R["w"], R["h"]>;

export const moveTo =
  <R extends Rect>(r: R) =>
  <X extends number, Y extends number>(x: X, y: Y) =>
    ({
      x: x,
      y: y,
      w: r.w,
      h: r.h,
    }) as Rect<X, Y, R["w"], R["h"]>;

export const inset =
  <R extends Rect>(r: R) =>
  <D extends number>(d: D) =>
    ({
      x: r.x + d,
      y: r.y + d,
      w: r.w - 2 * d,
      h: r.h - 2 * d,
    }) as Rect<Sum<[R["x"], D]>, Sum<[R["y"], D]>, Sum<[R["w"], Product<[-2, D]>]>, Sum<[R["h"], Product<[-2, D]>]>>;

export const outset =
  <R extends Rect>(r: R) =>
  <D extends number>(d: D) =>
    ({
      x: r.x - d,
      y: r.y - d,
      w: r.w + 2 * d,
      h: r.h + 2 * d,
    }) as Rect<
      Sum<[R["x"], Product<[-1, D]>]>,
      Sum<[R["y"], Product<[-1, D]>]>,
      Sum<[R["w"], Product<[2, D]>]>,
      Sum<[R["h"], Product<[2, D]>]>
    >;

// export type PartialRect<
//   X extends number = number,
//   Y extends number = number,
//   W extends number = number,
//   H extends number = number,
// > = Partial<Rect<X, Y, W, H>>;

// export type AddRects<A extends Rect, B extends Rect> = Rect<
//   Sum<[A["x"], B["x"]]>,
//   Sum<[A["y"], B["y"]]>,
//   Sum<[A["w"], B["w"]]>,
//   Sum<[A["h"], B["h"]]>
// >;

// export const add =
//   <A extends Rect>(a: A) =>
//   <B extends Rect>(b: B) =>
//     ({
//       x: a.x + b.x,
//       y: a.y + b.y,
//       w: a.w + b.w,
//       h: a.h + b.h,
//     }) as Rect<Sum<[A["x"], B["x"]]>, Sum<[A["y"], B["y"]]>, Sum<[A["w"], B["w"]]>, Sum<[A["h"], B["h"]]>>;
