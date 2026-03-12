import { describe as dt } from "~testing";

import Vor from "./vor";
import V from "./var";
import { __ } from "~js";

dt(Vor, () => ({
  empty: () => {
    // const v = Vor();
  },

  single_no_id: () => {
    const v = Vor(V.S("i"));
    v(["i", ""]);
  },
}));
