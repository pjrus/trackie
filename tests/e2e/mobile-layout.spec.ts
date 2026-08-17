import { expect, test } from "@playwright/test";

test("mobile workspace and editor remain usable", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile-chromium",
    "Mobile-only responsive check.",
  );
  await page.addInitScript(() => {
    localStorage.setItem(
      "jobApplications",
      JSON.stringify([{ id: "mobile", company: "Local Co", role: "Analyst" }]),
    );
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Trackie" })).toBeVisible();
  await page.getByRole("button", { name: "New application" }).click();

  const editor = page.getByRole("dialog");
  await expect(editor).toBeVisible();
  const box = await editor.boundingBox();
  const viewport = page.viewportSize();
  expect(box?.x).toBe(0);
  expect(box?.y).toBe(0);
  expect(Math.round(box?.width ?? 0)).toBe(viewport?.width);
  expect(Math.round(box?.height ?? 0)).toBe(viewport?.height);

  await page.getByRole("button", { name: "Cancel" }).click();
  const appliedColumn = page.getByRole("region", { name: "Applied" });
  const horizontallyScrollable = await appliedColumn.evaluate((element) => {
    const scrollContainer = element.parentElement?.parentElement;
    return Boolean(
      scrollContainer &&
        scrollContainer.scrollWidth > scrollContainer.clientWidth,
    );
  });
  expect(horizontallyScrollable).toBe(true);
});
