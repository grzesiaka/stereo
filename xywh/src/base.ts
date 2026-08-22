import { Sum, Product, Subtract, Max, Min } from "numyo";

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
  <W extends number, H extends number, const cR extends Rect>(w: W, h: H) =>
  <const R extends Rect>(r: Rect extends R ? cR : R) =>
    ({
      x: r.x,
      y: r.y,
      w: r.w + w,
      h: r.h + h,
    }) as Rect<R["x"], R["y"], Sum<[R["w"], W]>, Sum<[R["h"], H]>>;

export const resizeTo =
  <W extends number, H extends number, const cR extends Rect>(w: W, h: H) =>
  <const R extends Rect>(r: Rect extends R ? cR : R) =>
    ({
      x: r.x,
      y: r.y,
      w: w,
      h: h,
    }) as Rect<R["x"], R["y"], W, H>;

export const moveBy =
  <X extends number, Y extends number, const cR extends Rect>(x: X, y: Y) =>
  <const R extends Rect>(r: Rect extends R ? cR : R) =>
    ({
      x: r.x + x,
      y: r.y + y,
      w: r.w,
      h: r.h,
    }) as Rect<Sum<[R["x"], X]>, Sum<[R["y"], Y]>, R["w"], R["h"]>;

export const moveTo =
  <X extends number, Y extends number, const cR extends Rect>(x: X, y: Y) =>
  <const R extends Rect>(r: Rect extends R ? cR : R) =>
    ({
      x: x,
      y: y,
      w: r.w,
      h: r.h,
    }) as Rect<X, Y, R["w"], R["h"]>;

export const inset =
  <const D extends number, const cR extends Rect>(d: D) =>
  <const R extends Rect>(r: Rect extends R ? cR : R) =>
    ({
      x: r.x + d,
      y: r.y + d,
      w: r.w - 2 * d,
      h: r.h - 2 * d,
    }) as Rect<Sum<[R["x"], D]>, Sum<[R["y"], D]>, Sum<[R["w"], Product<[-2, D]>]>, Sum<[R["h"], Product<[-2, D]>]>>;

export const outset =
  <const D extends number, const cR extends Rect>(d: D) =>
  <const R extends Rect>(r: Rect extends R ? cR : R) =>
    ({
      x: r.x - d,
      y: r.y - d,
      w: r.w + 2 * d,
      h: r.h + 2 * d,
    }) as Rect<
      Subtract<R["x"], D>,
      Subtract<R["y"], D>,
      Sum<[R["w"], Product<[2, D]>]>,
      Sum<[R["h"], Product<[2, D]>]>
    >;

type _Intersect<
  A extends Rect,
  B extends Rect,
  X extends number = Max<[A["x"], B["x"]]>,
  Y extends number = Max<[A["y"], B["y"]]>,
  HO extends number = Min<[Sum<[A["x"], A["w"]]>, Sum<[B["x"], B["w"]]>]>,
  VE extends number = Min<[Sum<[A["y"], A["h"]]>, Sum<[B["y"], B["h"]]>]>,
> = Rect<X, Y, Max<[0, Subtract<HO, X>]>, Max<[0, Subtract<VE, Y>]>>;

export type Intersect<A extends Rect, B extends Rect> = _Intersect<A, B>;

export const intersect =
  <const A extends Rect, const cB extends Rect>(a: A) =>
  <const B extends Rect>(b: Rect extends B ? cB : B) => {
    const x = Math.max(a.x, b.x);
    const y = Math.max(a.y, b.y);
    const ho = Math.min(a.x + a.w, b.x + b.w);
    const ve = Math.min(a.y + a.h, b.y + b.h);
    return rect(x, y, Math.max(0, ho - x), Math.max(0, ve - y)) as Rect<
      Intersect<A, B>["x"],
      Intersect<A, B>["y"],
      Intersect<A, B>["w"],
      Intersect<A, B>["h"]
    >; // as Intersect<A, B> does not collapse to Rect in IDE;
  };

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
