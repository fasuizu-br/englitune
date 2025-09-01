import { expect, test } from "@playwright/test";
import { apiUrls, audioUrls } from "../env.config";

const mockEntry = {
  transcript: "Test sentence for study.",
  sequence: "001",
  speaker: "alice",
  age: 30,
  gender: "female",
  accent: "US"
};

test.describe("study flows", () => {
  test("dismisses welcome and loads study", async ({ page }) => {
    await page.route(`${apiUrls.development}**`, (route) =>
      route.fulfill({ json: [mockEntry] })
    );

    await page.goto("/");
    await page.getByRole("button", { name: /let's start learning/i }).click();
    await expect(page.getByText(/improve your english/i)).toBeVisible();
  });

  test("completes review and saves progress", async ({ page }) => {
    await page.route(`${apiUrls.development}**`, (route) =>
      route.fulfill({ json: [mockEntry] })
    );

    await page.route(`${audioUrls.development}/**`, (route) =>
      route.fulfill({ status: 200, body: Buffer.from([]) })
    );

    await page.goto("/");
    await page.getByRole("button", { name: /let's start learning/i }).click();

    await page.locator("audio").evaluate((e) => {
      e.dispatchEvent(new Event("loadedmetadata"));
      e.dispatchEvent(new Event("ended"));
    });

    await page.getByRole("button", { name: /show transcript/i }).click();
    await page.getByRole("button", { name: "Correct", exact: true }).click();

    const studies = await page.evaluate(() =>
      localStorage.getItem("englitune-studies")
    );
    expect(studies).toBeTruthy();
    expect(JSON.parse(studies!)).toHaveLength(1);
  });
});
