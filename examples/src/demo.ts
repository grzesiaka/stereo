// oxlint-disable no-undef

import { init, props as $, uy$html, $state } from "uiyui/html";

const ui = $.div({ id: "root" }, "a b")(
  $.h1({ textContent: "Hey you" })(),
  $.p({ id: "ppp", textContent: "What's up?" }),
  $.button({ id: "run", textContent: "Run" }),
);

const { dom, ids } = init(ui);

uy$html(ids.run)().onclick = () => $state(ids.root)(Math.random() > 0.5 ? "a" : "b");

console.log(ids, dom);
const div = uy$html(dom[0])();
document.body.append(div);
