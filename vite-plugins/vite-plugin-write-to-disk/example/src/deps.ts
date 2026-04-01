import { of, map, scan } from "rxjs";
import $ from "~dom";

export const x = of(1)
  .pipe(
    map((x) => x + x),
    scan(() => [], []),
  )
  .subscribe((x) => $.console.log("RxJS", x));
