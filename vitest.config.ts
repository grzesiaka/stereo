import { defineProject } from "vitest/config";

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
              customResolver: (p) => (p === "../out" ? "../out/index.mjs" : p.endsWith(".mjs") ? p : `${p}.mjs`),
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
