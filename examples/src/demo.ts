// oxlint-disable no-undef

import { init, props as $ } from "uiyui/html";

const ui = $.div()(
  $.h1({ textContent: "Hey you" })(),
  $.p({ id: "ppp", textContent: "What's up?" }),
  $.button({ id: "run", textContent: "Run" }),
);

const { dom, ids } = init(ui);

console.log(ids, dom);
document.body.append(dom[0].$());
