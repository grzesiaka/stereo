// oxlint-disable no-undef

// import "taskyo/cache/index-db";

import "taskyo/cache/memory";
import { task, run } from "taskyo";

const LOG =
  (msg = "") =>
  (p?: unknown) => {
    const div = document.createElement("div");
    Object.assign(div.style, { padding: "2px", margin: "2px", backgroundColor: "rgba(0,0,0,0.1)" });
    if (msg) {
      const h = document.createElement("b");
      h.innerText = msg;
      div.append(h);
    }
    if (p) {
      const h = document.createElement("pre");
      h.innerText = JSON.stringify(p, null, 4);
      div.append(h);
    }
    document.body.append(div);
  };
const LG = LOG();

const t = task.$((p: 1) => Promise.resolve(2))({
  Id: "",
  cache: {
    key: (p) => `${p}`,
    store: "memory",
    ttl: 1,
  },
});

const x = run(t)(1);
x.progress(LOG("%"));
x.then(LG);
