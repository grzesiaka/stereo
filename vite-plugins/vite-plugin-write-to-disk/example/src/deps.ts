import { of, map, scan } from "rxjs";

export const $ = of(1)
  .pipe(
    map((x) => x + x),
    scan(() => [], []),
  )
  .subscribe((x) => console.log("RxJS", x));
