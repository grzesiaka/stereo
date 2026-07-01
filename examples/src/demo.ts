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

const i = html.input(
  {
    value: "value",
  },
  { className: "klassName", classList: ["klassList"], props: { defaultValue: "propsik" } },
);

i.setAttribute("value", "over");

const a = html.a({ innerText: "LINK", href: `/#${Date.now()}/#abc` });
$.document.body.append(p.$.EL, i.$.EL, a.$.EL);
$.console.log(p, i, i.defaultValue, a);

// @ts-expect-error
// oxlint-disable-next-line no-undef
window.i = i;
$.console.log(i.$(), i.$("classList"), i.$());

// const div = html.div({}, { ok: "", abc: "", cde: "" });
const arr = html.div({ textContent: "abc" }, ["a", "b"]);
arr.$.VAR.X;
arr.$("b");
arr.$("a");
arr.$("a");

const btn = html.button("save", ["idle", "sending", "error"]);
const btn2 = html.button("load", {
  idle: {
    textContent: "idle",
  },
  loading: {
    textContent: "loading",
  },
  loaded: {
    textContent: "loaded",
  },
});

btn2.$.EL.onclick = () => {
  btn2.$("loading");
  btn2.textContent = "loading";
  $.setTimeout(() => {
    btn2.$("loaded");
    btn2.textContent = "loaded";
  }, 2000);
};

$.document.body.append(arr.$.EL, btn.$.EL, btn2.$.EL);
