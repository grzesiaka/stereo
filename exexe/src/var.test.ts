import { describe as dt } from "~testing";

import V from "./var";

dt(V, ({ eq, v }) => ({
  empty: () => {
    const x = V(1);
  },
}));
