import { ARR, Max, MsOrNumber, Sum, __ } from "jsyoyo";
import { ij_Project } from "proyij";

type Specs = ARR;

export type WithSumAvgTime<Ss extends Specs> = SumAvgTime<Ss> extends __ ? {} : { avgTime: SumAvgTime<Ss> };
export type SumAvgTime<Ss extends Specs> =
  ij_Project<["avgTime"], Ss> extends ARR<MsOrNumber> ? Sum<ij_Project<["avgTime"], Ss>> : __;

export const sumAvgTime = <Ss extends Specs>(ss: Ss): SumAvgTime<Ss> => {
  let s = 0;
  for (let i = 0; i < ss.length; i++) {
    const x = ss[i];
    if (typeof x?.avgTime === "number") {
      s += x.avgTime;
    } else {
      return __ as never;
    }
  }
  return s as never;
};

export type WithMaxAvgTime<Ss extends Specs> = MaxAvgTime<Ss> extends __ ? {} : { avgTime: MaxAvgTime<Ss> };
export type MaxAvgTime<Ss extends Specs> =
  ij_Project<["avgTime"], Ss> extends ARR<MsOrNumber> ? Max<ij_Project<["avgTime"], Ss>> : __;
export const maxAvgTime = <Ss extends Specs>(ss: Ss): MaxAvgTime<Ss> => {
  let s = 0;
  for (let i = 0; i < ss.length; i++) {
    const x = ss[i];
    if (typeof x?.avgTime === "number") {
      if (x.avgTime > s) {
        s = x.avgTime;
      }
    } else {
      return __ as never;
    }
  }
  return s as never;
};
