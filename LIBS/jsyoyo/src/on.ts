import { Fn, Fn$I } from "~types";
import { id } from "./id";
import { OnOff } from "./s-emitter";

type ResolveCbs<T> = T extends { on: infer On extends Fn }
  ? Fn$I<On>
  : T extends { addEventListener: infer On extends Fn }
    ? Fn$I<On>
    : [string, () => void];

export const ON =
  <T extends Partial<OnOff> = Partial<OnOff>>(t: T) =>
  (...kvo: ResolveCbs<T>) =>
    // ...kvo does not work
    (
      (t.on || t.addEventListener || (() => 1))(kvo[0], kvo[1], kvo[2]),
      () => (t.off || t.removeEventListener || id)(kvo[0], kvo[1])
    );

export default ON;
