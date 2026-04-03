// oxlint-disable no-undef
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const prepareIndices = async (root: string, withDirs: boolean): Promise<[string, string][]> => {
  const path = (...sub: string[]) => resolve(root, ...sub);
  const dir = await readdir(path());
  const files = dir.filter((x) => x.endsWith(".ts") && x !== "index.ts").map((f) => f.replace(/\.ts$/, ""));
  let sub = [] as [string, string][];
  if (withDirs) {
    sub = await Promise.all(
      dir.filter((t) => !t.endsWith(".ts") && !t.startsWith("_")).flatMap((sub) => prepareIndices(path(sub), false)),
    ).then((x) => x.flat());
  }
  const indexContent = sub
    .map((f) => `export * from ".${f[0].replace(path(), "").replace(/\.ts$/, "")}"`)
    .concat(sub.length ? [""] : [])
    .concat(
      files.map((f) =>
        f === "_default" ? `\nimport X from "./_default";\nexport default X;` : `export * from "./${f}"`,
      ),
    )
    .join("\n")
    .concat("\n");
  return [[path("index.ts"), indexContent], ...sub];
};

const setExports = (root: string) => {
  const pkgPath = resolve(root, "package.json");

  Promise.all([readFile(pkgPath, { encoding: "utf-8" }), prepareIndices(resolve(root, "src"), true)]).then(
    ([_pkg, indices]) => {
      indices.forEach(([path, content]) => content.trim() && writeFile(path, content, "utf-8"));
      const exports = indices
        .map(([p]) => p.split("src/").pop()!.replace("/index.ts", ""))
        .filter((x) => x !== "index.ts");
      const pkg = JSON.parse(_pkg);
      pkg.exports = exports.reduce((a, n) => {
        a[`./${n}`] = `./out/${n}/index.mjs`;
        a[`./${n}/*`] = `./out/${n}/*.mjs`;
        return a;
      }, pkg.exports);
      writeFile(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
    },
  );
};

const skip = new Set(["__config", "node_modules", "out", "LICENSE", "vite-plugins"]);

const handleDown = (path: string, isRoot: boolean) => {
  readdir(path).then((files) => {
    for (let f of files) {
      if (!isRoot && f === "package.json") {
        setExports(path);
      }
      if (!f.includes(".") && !skip.has(f)) {
        handleDown(resolve(path, f), false);
      }
    }
  });
};

// oxlint-disable-next-line no-undef
handleDown(process.argv[2] || process.cwd(), true);
