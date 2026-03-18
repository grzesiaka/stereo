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
              customResolver: (a, b, c) => {
                return a === "../out" ? "../out/index.mjs" : `${a}.mjs`;
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
