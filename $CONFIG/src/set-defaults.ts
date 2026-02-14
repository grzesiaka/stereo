// oxlint-disable no-unused-expressions
import { readdir, mkdir, readFile, writeFile } from "node:fs";
import { resolve } from "node:path";

const tsconfig = `{
  "extends": "./node_modules/~cfg/tsconfig.dev.json"
}
`;

const setDefaults = (root: string, files: string[]) => {
  const pkgPath = resolve(root, "package.json");
  readFile(pkgPath, { encoding: "utf-8" }, (_, data) => {
    const pkg = JSON.parse(data);

    pkg.version = pkg.version || "0.0.0";

    pkg.scripts = pkg.scripts || {};
    !pkg.scripts.build && (pkg.scripts.build = "tsc -p node_modules/~cfg/tsconfig.build.json");
    !pkg.scripts.dev && (pkg.scripts.dev = "tsc --watch -p node_modules/~cfg/tsconfig.build.json");
    !pkg.exports &&
      (pkg.exports = {
        ".": {
          types: "./out/index.d.ts",
          default: "./out/index.js",
        },
        "./*": "./out/*",
      });

    !("sideEffects" in pkg) && (pkg.sideEffects = false);

    writeFile(pkgPath, JSON.stringify(pkg, null, 2), () => 1);
  });

  if (!files.includes("src")) {
    mkdir(resolve(root, "src"), () => {
      writeFile(resolve(root, "src/index.ts"), `//${root}`, {}, () => 1);
    });
  }

  if (!files.includes("tsconfig.json")) {
    writeFile(resolve(root, "tsconfig.json"), tsconfig, () => 1);
  }
};

const skip = new Set(["$CONFIG", "node_modules", "src", "out"]);

const handleDown = (path: string, isRoot: boolean) => {
  readdir(path, (err, files) => {
    if (!err) {
      for (let f of files) {
        if (!isRoot && f === "package.json") {
          setDefaults(path, files);
        }
        if (!f.includes(".") && !skip.has(f)) {
          handleDown(resolve(path, f), false);
        }
      }
    }
  });
};

// oxlint-disable-next-line no-undef
handleDown(process.argv[2] || process.cwd(), true);
