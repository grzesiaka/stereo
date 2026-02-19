import { of, map } from "rxjs";

export const $ = of(1)
  .pipe(
    map((x) => x + x),
  )
  .subscribe((x) => console.log('RxJS', x));
  