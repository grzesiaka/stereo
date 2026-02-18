// oxlint-disable no-unused-expressions
// oxlint-disable no-undef
module.exports = {
  hooks: {
    beforePacking(pkg) {
      delete pkg.devDependencies;
      delete pkg.scripts;
      pkg.publishedAt = new Date().toISOString();
      pkg.files = pkg.files || ["out/**/*"];
      return pkg;
    },
    readPackage(pkg) {
      if (!pkg.name !== "~cfg") {
        pkg.dependencies["~cfg"] = "workspace:";
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
      }
      return pkg;
    },
  },
};
