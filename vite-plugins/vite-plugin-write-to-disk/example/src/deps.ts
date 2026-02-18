import { of, map } from "rxjs";

export const $ = of(1)
  .pipe(
    map((x) => x + x),
    map(() => console.log("/")),
  )
  .subscribe((x) => console.log(x));

// fetch("/");
