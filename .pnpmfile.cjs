// oxlint-disable no-unused-expressions
// oxlint-disable no-undef
module.exports = {
  hooks: {
    beforePacking(pkg) {
      delete pkg.devDependencies;
      delete pkg.scripts;
      pkg.publishedAt = new Date().toISOString();
      pkg.files = pkg.files || ["out/**/*"];
      pkg.license = "NON-AI-MIT";
      return pkg;
    },
    readPackage(pkg) {
      if (!pkg.name !== "~cfg") {
        pkg.devDependencies["~cfg"] = "workspace:";
        pkg.devDependencies["type-fest"] = "catalog:";

        if (pkg.scripts?.test) {
          pkg.devDependencies["vitest"] = "catalog:";
          pkg.devDependencies["~testing"] = "workspace:";
        }
      }
      return pkg;
    },
  },
};
