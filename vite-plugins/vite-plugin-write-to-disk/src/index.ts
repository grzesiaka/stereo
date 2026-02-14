import { resolve } from "node:path";
import type { PluginOption, ResolvedConfig } from "vite";

import $ from "~nodejs";

const L = $.console.log.bind($.console);

export default () => {
  let cfg: ResolvedConfig;
  const src = (...seg: string[]) => resolve(cfg.envDir || import.meta.dirname, ...seg);
  //L(cfg, src);

  return {
    name: "vite-plugin-write-to-disk",
    apply: "serve",
    enforce: "post",

    config(u) {
      L(u);
      return {
        server: {
          warmup: {
            clientFiles: ["**/*", "!public/"],
          },
        },
      };
    },

    configResolved(_cfg) {
      // $.console.log(_cfg);
      cfg = _cfg;
      this.info("RESOLVED");
      L("\n\nSRC", src());
      L(cfg.resolve.alias);
    },

    // augmentChunkHash(a) {
    //   L("hash\n", a);
    // },

    // resolveId(a, b, c) {
    //   L("resolve-id\n", a, b, c);
    // },

    // transformIndexHtml: (code, ctx) => {
    //   L("trans-html\n", ctx.filename);
    //   // L(code)
    //   return code;
    // },
    // transform: (code, id, opt) => {
    //   L("trans\n", id, opt);
    //   L(code);
    //   return code;
    // },
    // handleHotUpdate: async (x) => {
    //   const b = await x.read();
    //   L("hot", x.file, b);
    // },
    // hotUpdate: async (x) => {
    //   const b = await x.read();
    //   L("hotU", x.file, b);
    // },
  } satisfies PluginOption;
};
