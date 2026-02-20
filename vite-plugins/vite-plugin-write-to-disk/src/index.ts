// oxlint-disable no-undef
import { rm, cp, mkdir, writeFile, symlink, chmod } from "node:fs/promises";
import { resolve, dirname, relative } from "node:path";
import type { MinimalPluginContextWithoutEnvironment, PluginOption, ResolvedConfig } from "vite";

import $ from "~nodejs";

const L = $.console.log.bind($.console);

export interface WriteToDiskOptions {
  /**
   * A path to `node_modules`, relative to `root`.
   * It will create a symlink from `outDir`.
   * Set to `null` or `undefined` to not symlinking.
   */
  node_modules?: string | null | undefined;
}

const defOptions = {
  node_modules: "../node_modules",
} as const satisfies WriteToDiskOptions;

export default (options: WriteToDiskOptions | ((defaultOptions: typeof defOptions) => WriteToDiskOptions)) => {
  const opt = Object.assign({}, defOptions, typeof options === "function" ? options(defOptions) : options);
  let ctx: MinimalPluginContextWithoutEnvironment;
  let cfg: ResolvedConfig;

  const onError = (message: string) => (cause: unknown) => {
    ctx.warn({ message, cause });
    ctx.warn("Address the issue and restart");
    L(cause);
    return new Promise(() => 1);
  };

  const src = (...seg: string[]) => resolve(cfg.root, ...seg);
  const srcRelative = (path: string) => relative(src(), path);
  const out = (...seg: string[]) => resolve(cfg.build.outDir, ...seg);
  let node_modules: string;

  const viteOrigin = () => `http${cfg.server.https ? "s" : ""}://${cfg.server.host || "localhost"}:${cfg.server.port}`;

  const rebaseHTML = (file: string, content: string) =>
    content.replace("<head>", `<head><base href="${viteOrigin()}/${srcRelative(file)}"/>`);
  // .replace("/@vite/client", `${viteOrigin()}/@vite/client`)
  // .replace(/(<script .*)src=(.*).ts/g, "$1src=$2.js")
  // .replace(/(<link .*)href=(")(.*).css/g, `$1href=$2${viteOrigin()}/$3.css`);

  const initOutDir = () =>
    cp(cfg.publicDir, out(), { recursive: true, force: true })
      .then(() => chmod(out(), 0o777))
      .catch(onError("Coping public to out dir failed."))
      .then(() => opt.node_modules && symlink(node_modules, out("node_modules")));

  const writeToDisk = async (srcPath: string, content: string) => {
    if (node_modules && srcPath.includes("node_modules")) return;
    let relative = srcPath.replace(srcPath.startsWith(cfg.publicDir) ? cfg.publicDir : src(), "").substring(1);
    if (relative.length + 1 === srcPath.length) {
      return;
    }
    const dir = dirname(relative);
    if (dir.length) {
      await mkdir(out(dir), { recursive: true, mode: 0o777 });
    }

    return writeFile(out(relative).replace(/.ts$/, ".js"), content).catch(onError(`Failed to write file: ${srcPath}`));
  };

  return {
    name: "vite-plugin-write-to-disk",
    apply: "serve",
    enforce: "post",

    config(cfg) {
      return {
        server: {
          warmup: {
            // public is copied as such
            clientFiles: ["**/*", cfg.publicDir || "!public/", '!**/*d.ts'],
          },
        },
      };
    },

    configResolved(_cfg) {
      // oxlint-disable-next-line typescript/no-this-alias
      ctx = this;
      cfg = _cfg;
      node_modules = src(opt.node_modules);
      this.info("config resolved");
    },

    buildStart() {
      if (cfg.build.emptyOutDir) {
        return rm(out(), { force: true, recursive: true }).catch(onError("Removing out dir failed.")).then(initOutDir);
      }
      return initOutDir();
    },

    transformIndexHtml: (code, ctx) => {
      // L("trans-html\n", ctx.filename);
      // L(code);
      writeToDisk(ctx.filename, rebaseHTML(ctx.filename, code));
      return code;
    },
    transform(code, id) {
      this.emitFile({ })
      L("trans\n", id, code.substring(0, 128));
      writeToDisk(id, code);
      return code;
    },
    async handleHotUpdate(x) {
      const content = await x.read();
      L("hot", x.file, content);
      writeToDisk(x.file, content);
    },
  } satisfies PluginOption;
};
