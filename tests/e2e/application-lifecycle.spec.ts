import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test("application lifecycle persists and round-trips through JSON", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile-chromium",
    "Lifecycle drag coverage runs in the desktop project.",
  );
  await page.goto("/");

  await page.getByRole("button", { name: "New application" }).click();
  await page.getByRole("textbox", { name: "Company" }).fill("Canva");
  await page
    .getByRole("textbox", { name: "Role" })
    .fill("Product designer");
  await page.getByRole("button", { name: "Add application" }).click();
  await expect(page.getByText("Product designer")).toBeVisible();

  // Pointer move from Applied to Online Assessment.
  const dragHandle = page.getByRole("button", { name: "Move Canva" });
  const destination = page.getByRole("region", {
    name: "Online Assessment",
  });
  const sourceBox = await dragHandle.boundingBox();
  const destinationBox = await destination.boundingBox();
  expect(sourceBox).not.toBeNull();
  expect(destinationBox).not.toBeNull();
  await page.mouse.move(
    sourceBox!.x + sourceBox!.width / 2,
    sourceBox!.y + sourceBox!.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    destinationBox!.x + destinationBox!.width / 2,
    destinationBox!.y + 100,
    { steps: 12 },
  );
  await page.mouse.up();
  await expect(destination).toContainText("Product designer");

  // Keyboard move to the next stage.
  await page.getByRole("button", { name: "Move Canva" }).focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Space");
  await expect(page.getByRole("region", { name: "Phone Screen" })).toContainText(
    "Product designer",
  );

  await page.getByText("Product designer").click();
  await page.getByRole("textbox", { name: "Notes" }).fill("Portfolio sent");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.reload();
  await expect(page.getByText("Product designer")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Import \/ Export/ }).click();
  await page.getByRole("menuitem", { name: "JSON backup" }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const backup = Buffer.concat(chunks);

  await page.getByText("Product designer").click();
  await page
    .getByRole("button", { name: "Delete application" })
    .first()
    .click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete application" })
    .click();
  await expect(page.getByText("Product designer")).toHaveCount(0);

  await page.getByRole("button", { name: /Import \/ Export/ }).click();
  await page.getByRole("menuitem", { name: "Import applications" }).click();
  await page.locator('input[type="file"]').setInputFiles({
    name: "applications.json",
    mimeType: "application/json",
    buffer: backup,
  });
  await page.getByRole("button", { name: "Preview import" }).click();
  await page.getByRole("button", { name: "Import 1" }).click();
  await expect(page.getByText("Product designer")).toBeVisible();

  await page.getByText("Product designer").click();
  await page
    .getByRole("button", { name: "Delete application" })
    .first()
    .click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete application" })
    .click();
  await expect(page.getByText("Your workspace is ready")).toBeVisible();
});
