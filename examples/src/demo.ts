// oxlint-disable no-undef
// import * as TYP from "typier";
// import * as IO from "ioioy";

import $ from "envyo/web";

// console.log("OK", TYP, IO);

import { htmlProxy as html } from "uiyui";

const { br } = html;

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
document.body.append(p, i, a);
console.log(p, i, i.defaultValue, a);

// @ts-expect-error
// oxlint-disable-next-line no-undef
window.i = i;
console.log(i.$(), i.$("classList"), i.$());

// const div = html.div({}, { ok: "", abc: "", cde: "" });
const arr = html.div({ textContent: "abc" }, ["a", "b"]);
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

btn.$({ textContent: "idle" });
btn.onclick = () => {
  btn.$("sending");
  btn.textContent = "sending";
  setTimeout(() => {
    btn.$("error");
    btn.$({ textContent: "error" });
  }, 2000);
};

btn2.onclick = () => {
  btn2.$("loading");

  setTimeout(() => {
    btn2.$("loaded");
  }, 2000);
};

const d = btn2.$.on({
  click(p) {
    console.log("CLICK", this, p);
    d();
  },
  focus: (ev) => console.log("FOCUS", this, ev),
});

console.log(btn.tagName);
const tarea = html.textarea("abc");

tarea.$({
  contentEditable: "false",
});

document.body.append(btn, btn2, br(), tarea, tarea, tarea);

console.log(document.createElement("BUTTON").tagName);
