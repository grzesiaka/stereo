import { of, map } from "rxjs";

export const $ = of(1)
  .pipe(
    map((x) => x + x),
    map(() => alert("abc")),
  )
  .subscribe((x) => console.log(x));

fetch("/");
