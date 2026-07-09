// oxlint-disable no-undef

import { $el, init, props as $, props$el } from "uiyui/html";

const ui = $.div()(
  $.h1({ textContent: "Hey you" })(),
  $.p({ textContent: "What's up?" }),
  $.button({ textContent: "Run" }),
);

const el = init(ui);
document.body.append(el[0].$());
