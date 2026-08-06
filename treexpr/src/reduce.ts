import { TagParam, TREExprs } from "./base";
import map from "./map";

export const reduce =
  <Accu>(accu: () => Accu) =>
  <TP extends TagParam, cT extends TREExprs<TP> = TREExprs<TP>>(
    reduceFn: (x: Accu) => (tag_param: TP, from_root: TREExprs<TP>) => unknown,
  ) =>
  <T extends TREExprs<TP>>(exp: TREExprs<TP> extends T ? cT : T): Accu => {
    const x = accu();
    map(reduceFn(x))(exp); // TODO: optimize by removing map; just traverse the expression
    return x;
  };

export default reduce;
