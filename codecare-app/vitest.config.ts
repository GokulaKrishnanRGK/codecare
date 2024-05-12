/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    setupFiles: ["src/test/setupTests.ts"],
    css: true,
    globals: true,
    pool: "threads",
    fakeTimers: {
      toFake: ["Date", "setTimeout", "clearTimeout", "setInterval", "clearInterval"],
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: ["src/test/**", "**/*.d.ts", "**/*.config.*", "dist/**"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
