import { defineProject } from "vitest/config";
import { resolve } from "node:path";

export default defineProject({
  test: {
    projects: [
      "**/test",
      "!**/example",
      {
        test: {
          name: "unit",
        },
      },
      {
        resolve: {
          alias: [
            {
              find: /src/,
              replacement: "out",
              customResolver: (p, importer) => {
                let r = p === "../out" ? "../out/index.mjs" : p.endsWith(".mjs") ? p : `${p}.mjs`;
                r = importer ? resolve(importer, "..", r) : r; // using `@vitest-environment jsdom|happy-dom` breaks path resolution sadly :(
                return r;
              },
            },
          ],
        },
        test: {
          name: "unit/out",
        },
      },
    ],
  },
});
