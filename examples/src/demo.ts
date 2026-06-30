import * as TYP from "typier";
import * as IO from "ioioy";

import "~dom";
import { $ } from "~dom";

$.console.log("OK", TYP, IO, $);

import { htmlProxy as html } from "uiyui";

const p = html.p({
  innerText: "abc",
  className: "abc cde",
  style: {
    fontWeight: "bold",
  },
});

const i = html.input({
  value: "value",
});

i.setAttribute("value", "over");

const a = html.a({ innerText: "LINK", href: `/#${Date.now()}/#abc` });
$.document.body.append(p.$EL, i.$EL, a.$EL);
$.console.log(p, i, i.defaultValue, a);
