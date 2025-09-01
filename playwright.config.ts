import { defineConfig, devices } from "@playwright/test";
import { apiUrls, audioUrls, turnstileSiteKeys } from "./env.config";

export default defineConfig({
  testDir: "./e2e",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  use: {
    baseURL: "http://localhost:5173"
  },
  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_TURNSTILE_SITE_KEY: turnstileSiteKeys.development,
      VITE_API_URL: apiUrls.development,
      VITE_AUDIO_URL: audioUrls.development
    }
  }
});
