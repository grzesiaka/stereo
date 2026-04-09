// oxlint-disable no-unused-expressions
import { readdir, mkdir, readFile, writeFile } from "node:fs";
import { resolve } from "node:path";

const tsconfig = `{
  "extends": "./node_modules/~cfg/tsconfig.dev.json"
}
`;

const testIndex = `import { describe } from '~testing'
import * as I from '../src/index'

describe('', ({ eq }) => ({
}))
`;

const azKeysOrder = (obj: object) =>
  Object.keys(obj)
    .sort()
    // @ts-expect-error
    .reduce((a, k) => ((a[k] = obj[k]), a), {});

const setDefaults = (root: string, files: string[]) => {
  const pkgPath = resolve(root, "package.json");
  readFile(pkgPath, { encoding: "utf-8" }, (_, data) => {
    const pkg = JSON.parse(data);

    pkg.version = pkg.version || "1.0.0-alpha.0";

    pkg.scripts = pkg.scripts || {};
    pkg.type = "module";

    !pkg.scripts.build &&
      (pkg.scripts.build =
        "tsdown ./src/*.ts ./src/*/*.ts !./src/_*.ts !./src/_*/*.ts !./src/*/_*.ts --minify --sourcemap --dts --clean -d=./out --tsconfig node_modules/~cfg/tsconfig.build.json");
    !pkg.scripts.dev && (pkg.scripts.dev = "pnpm build --watch");

    !pkg.scripts.dev$ && (pkg.scripts.dev$ = `turbo run dev --filter='${pkg.name}'...`);
    !pkg.scripts.build$ && (pkg.scripts.build$ = `turbo run build --filter='${pkg.name}'...`);

    !pkg.scripts.test && (pkg.scripts.test = "vitest test --passWithNoTests --project unit");
    !pkg.scripts["test-ci"] && (pkg.scripts["test-ci"] = "vitest test --passWithNoTests --project unit/out");
    pkg.scripts.tsc = "tsc --noEmit -p node_modules/~cfg/tsconfig.build.json";

    pkg.scripts = azKeysOrder(pkg.scripts);

    !pkg.exports &&
      (pkg.exports = {
        ".": "./out/index.mjs",
        "./*": "./out/*.mjs",
      });

    !("sideEffects" in pkg) && (pkg.sideEffects = false);

    writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n", () => 1);
  });

  if (!files.includes("src")) {
    mkdir(resolve(root, "src"), () => {
      writeFile(resolve(root, "src/index.ts"), `export default "${root.split("/").pop()}"`, {}, () => 1);
    });
  }

  if (!files.includes("test")) {
    mkdir(resolve(root, "test"), () => {
      writeFile(resolve(root, "test/index.test.ts"), testIndex, {}, () => 1);
    });
  }

  if (!files.includes("tsconfig.json")) {
    writeFile(resolve(root, "tsconfig.json"), tsconfig, () => 1);
  }
};

const skip = new Set(["__config", "node_modules", "src", "out"]);

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
