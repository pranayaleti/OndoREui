import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["test/setup.ts"],
    include: ["lib/**/*.test.{ts,tsx}", "components/**/*.test.{ts,tsx}", "hooks/**/*.test.{ts,tsx}", "app/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/tests/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "json-summary"],
      include: ["lib/**/*.ts", "lib/**/*.tsx", "components/**/*.ts", "components/**/*.tsx", "hooks/**/*.ts", "hooks/**/*.tsx"],
      exclude: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "**/tests/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
