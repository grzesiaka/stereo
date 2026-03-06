import { UnknownRecord } from "type-fest";
import { __, a, Cb } from "~js";

type Callees<X = unknown> = Set<Cb<X>>;

type Input<X> = ((x: X) => void) & {
  cs: Callees<X>;
  x?: X;
};

export const input = <X>(keepValue = true, callees = new Set<Cb<X>>()): Input<X> => {
  const $ = (
    keepValue
      ? (x) => {
          $.x = x;
          $.cs.forEach((c) => c(x));
        }
      : (x) => {
          $.cs.forEach((c) => c(x));
        }
  ) as Input<X>;
  $.cs = callees;
  return $;
};

interface ObserveOptions<X = unknown, Info extends UnknownRecord = {}> {
  callees: Callees<X>;
  info?: Info;
  onAdd?: (cs: Callees<X>, x: Cb<X>) => () => void;
}

const onAdd = <X>(cs: Callees<X>, x: Cb<X>) => (cs.add(x), () => cs.delete(x));
export const observe =
  <X, Options extends ObserveOptions<X>>(opt: Options) =>
  (x: Cb<X>) =>
    a((opt.onAdd || onAdd)(opt.callees, x as any), opt.info) as (() => void) & Options["info"];

export const io = () => 1;
