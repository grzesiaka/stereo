// oxlint-disable no-unused-expressions
import { readdir, rm } from "node:fs";
import { resolve } from "node:path";

const skip = new Set(["src"]);
const targets = new Set(["node_modules", "out", ".turbo"]);

const handleDown = (path: string) => {
  readdir(path, (err, files) => {
    if (!err) {
      for (let f of files) {
        if (targets.has(f)) {
          // oxlint-disable-next-line no-undef
          rm(resolve(path, f), { force: true, recursive: true }, (e) => e && console.error(e));
        } else if (!f.includes(".") && !skip.has(f)) {
          handleDown(resolve(path, f));
        }
      }
    }
  });
};

// oxlint-disable-next-line no-undef
handleDown(process.argv[2] || process.cwd());
