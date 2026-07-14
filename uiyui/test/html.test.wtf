import { ast1$act } from "deacted";

import { props as $, HTMLTagAndProps } from "../src/html";

const bs = $.div({ id: "root" }, "a b")(
  $.h1({ textContent: "Hey you" })(),
  // $.h1({ textContent: "Hey you" })(), <---- UNCOMMENT to force ts2598
  $.p({ id: "ppp", textContent: "What's up?" }),
  $.button({ id: "run", textContent: "Run" }),

  $.p({ id: "ppp", textContent: "What's up?" }),
  $.button({ id: "run", textContent: "Run" }),

  $.h1({ textContent: "Hey you" })(),
  $.p({ id: "ppp", textContent: "What's up?" }),
  $.button({ id: "run", textContent: "Run" }),

  $.h1({ textContent: "Hey you" })(),
  $.p({ id: "ppp", textContent: "What's up?" }),
  $.button({ id: "run", textContent: "Run" }),

  $.button({ id: "run9", textContent: "Run" }),

  $.button({ id: "run99", textContent: "Run" }),

  $.button({ id: "run", textContent: "Run" }),
);
// type AST = HTML_AST<"button" | "div" | "p" | "h1">;
// const map = {
//   button: () => "B_T_N" as const,
// };

type TP = HTMLTagAndProps<"button" | "p" | "h1" | "div">;

const b = ast1$act<TP>()({
  button: (x) => "<button />" as const,
})()(bs);
