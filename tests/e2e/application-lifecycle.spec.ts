import { expect, test } from "@playwright/test";

// Each test runs in a fresh context, so localStorage already starts empty. An
// init script would re-clear it on the reload below and drop the saved record.

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
  await expect(page.getByRole("heading", { name: "Product designer" })).toBeVisible();

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

  // Keyboard move to the next stage. Each press waits on the drag
  // announcement so the assertions follow the drag instead of racing it.
  const announcements = page.locator("[id^='DndLiveRegion']");
  await page.getByRole("button", { name: "Move Canva" }).focus();
  await page.keyboard.press("Space");
  await expect(announcements).toContainText("Over Online Assessment.");
  // dnd-kit binds its arrow-key handling one task after the drag starts.
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve)));
  await page.keyboard.press("ArrowRight");
  await expect(announcements).toContainText("Over Phone Screen.");
  await page.keyboard.press("Space");
  await expect(page.getByRole("region", { name: "Phone Screen" })).toContainText(
    "Product designer",
  );

  await page.getByRole("heading", { name: "Product designer" }).click();
  await page.getByRole("textbox", { name: "Notes" }).fill("Portfolio sent");
  await page.getByRole("button", { name: "Save changes" }).click();
  // Saving routes back to the board; reloading before that lands on the editor.
  await expect(page).toHaveURL(/\/$/);
  await page.reload();
  await expect(page.getByRole("region", { name: "Phone Screen" })).toContainText(
    "Product designer",
  );

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Import \/ Export/ }).click();
  await page.getByRole("menuitem", { name: "JSON backup" }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const backup = Buffer.concat(chunks);

  await page.getByRole("heading", { name: "Product designer" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete application" })
    .click();
  await expect(page.getByRole("heading", { name: "Product designer" })).toHaveCount(0);

  await page.getByRole("button", { name: /Import \/ Export/ }).click();
  await page.getByRole("menuitem", { name: "Import applications" }).click();
  await page.locator('input[type="file"]').setInputFiles({
    name: "applications.json",
    mimeType: "application/json",
    buffer: backup,
  });
  await page.getByRole("button", { name: "Preview import" }).click();
  await page.getByRole("button", { name: "Import 1" }).click();
  await expect(page.getByRole("heading", { name: "Product designer" })).toBeVisible();

  await page.getByRole("heading", { name: "Product designer" }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete application" })
    .click();
  await expect(page.getByText("Your workspace is ready")).toBeVisible();
});
