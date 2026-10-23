/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
const dirname = path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
  base: "/rest-countries-api-with-color-theme-switcher/",
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
  plugins: [react(), tailwindcss()],
    test: {
      projects: [
        // 1. Unit tests (reducer, utils, React Testing Library)
        {
          extends: true,
          test: {
            name: "unit",
            environment: "jsdom",
            setupFiles: ["./src/setupTests.js"],
            include: ["src/**/*.test.{js,jsx}"],
          },
        },

        // 2. Storybook tests
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: path.join(dirname, ".storybook"),
            }),
          ],
          test: {
            name: "storybook",
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({
                launchOptions: env.BROWSER_PATH
                  ? { executablePath: env.BROWSER_PATH }
                  : {},
              }),
              instances: [{ browser: "chromium" }],
            },
          },
        },
      ],
    },
  };
});
