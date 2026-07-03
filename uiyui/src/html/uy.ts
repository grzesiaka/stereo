import { __ } from "jsyoyo";
import { htmlProxy } from "./proxy";
import { expressify } from "xpresyo";

export const htmlUY = <L = __>(L?: L) => {
  //@ts-expect-error ts2590
  const { cmd, run } = expressify(htmlProxy)((a, b) => a.append(...b));

  const { div, p, video } = cmd;
  const uiAst = div("top")(video("left")(p("p")()));
  const _ui = run(uiAst);
  _ui.__[2];
  // oxlint-disable-next-line no-undef
  console.log(L, _ui);
};
