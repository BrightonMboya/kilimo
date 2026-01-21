import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "../../apps/nextjs/src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/tests/setup.ts"],
    // Run tests serially to avoid database conflicts
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    env: {
      DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
      DIRECT_URL: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
      NODE_ENV: "test",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/tests/",
        "**/*.config.*",
        "**/index.ts",
      ],
    },
  },
});
