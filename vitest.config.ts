import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    // Date formatting is locale/timezone dependent: pin it so results match everywhere.
    env: { TZ: "Europe/Paris" },
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts", "src/app/actions/**/*.ts"],
      exclude: ["src/generated/**"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        // Runs against a real PostgreSQL (DATABASE_URL), see tests/integration/setup.ts
        extends: true,
        test: {
          name: "integration",
          include: ["tests/integration/**/*.test.ts"],
          setupFiles: ["tests/integration/setup.ts"],
          fileParallelism: false,
        },
      },
    ],
  },
});
