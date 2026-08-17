# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: application-lifecycle.spec.ts >> application lifecycle persists and round-trips through JSON
- Location: tests/e2e/application-lifecycle.spec.ts:7:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByRole('region', { name: 'Phone Screen' })
Expected substring: "Product designer"
Received string:    "Phone Screen0Drop an application here"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for getByRole('region', { name: 'Phone Screen' })
    14 × locator resolved to <section aria-labelledby="stage-phone-screen" class="w-[315px] shrink-0 rounded-xl border bg-secondary/35 p-3 ">…</section>
       - unexpected value "Phone Screen0Drop an application here"

```

```yaml
- region "Phone Screen":
  - heading "Phone Screen" [level=2]
  - text: 0 Drop an application here
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | test.beforeEach(async ({ page }) => {
  4   |   await page.addInitScript(() => localStorage.clear());
  5   | });
  6   | 
  7   | test("application lifecycle persists and round-trips through JSON", async ({
  8   |   page,
  9   | }, testInfo) => {
  10  |   test.skip(
  11  |     testInfo.project.name === "mobile-chromium",
  12  |     "Lifecycle drag coverage runs in the desktop project.",
  13  |   );
  14  |   await page.goto("/");
  15  | 
  16  |   await page.getByRole("button", { name: "New application" }).click();
  17  |   await page.getByRole("textbox", { name: "Company" }).fill("Canva");
  18  |   await page
  19  |     .getByRole("textbox", { name: "Role" })
  20  |     .fill("Product designer");
  21  |   await page.getByRole("button", { name: "Add application" }).click();
  22  |   await expect(page.getByText("Product designer")).toBeVisible();
  23  | 
  24  |   // Pointer move from Applied to Online Assessment.
  25  |   const dragHandle = page.getByRole("button", { name: "Move Canva" });
  26  |   const destination = page.getByRole("region", {
  27  |     name: "Online Assessment",
  28  |   });
  29  |   const sourceBox = await dragHandle.boundingBox();
  30  |   const destinationBox = await destination.boundingBox();
  31  |   expect(sourceBox).not.toBeNull();
  32  |   expect(destinationBox).not.toBeNull();
  33  |   await page.mouse.move(
  34  |     sourceBox!.x + sourceBox!.width / 2,
  35  |     sourceBox!.y + sourceBox!.height / 2,
  36  |   );
  37  |   await page.mouse.down();
  38  |   await page.mouse.move(
  39  |     destinationBox!.x + destinationBox!.width / 2,
  40  |     destinationBox!.y + 100,
  41  |     { steps: 12 },
  42  |   );
  43  |   await page.mouse.up();
  44  |   await expect(destination).toContainText("Product designer");
  45  | 
  46  |   // Keyboard move to the next stage.
  47  |   await page.getByRole("button", { name: "Move Canva" }).focus();
  48  |   await page.keyboard.press("Space");
  49  |   await page.keyboard.press("ArrowRight");
  50  |   await page.keyboard.press("Space");
> 51  |   await expect(page.getByRole("region", { name: "Phone Screen" })).toContainText(
      |                                                                    ^ Error: expect(locator).toContainText(expected) failed
  52  |     "Product designer",
  53  |   );
  54  | 
  55  |   await page.getByText("Product designer").click();
  56  |   await page.getByRole("textbox", { name: "Notes" }).fill("Portfolio sent");
  57  |   await page.getByRole("button", { name: "Save changes" }).click();
  58  |   await page.reload();
  59  |   await expect(page.getByText("Product designer")).toBeVisible();
  60  | 
  61  |   const downloadPromise = page.waitForEvent("download");
  62  |   await page.getByRole("button", { name: /Import \/ Export/ }).click();
  63  |   await page.getByRole("menuitem", { name: "JSON backup" }).click();
  64  |   const download = await downloadPromise;
  65  |   const stream = await download.createReadStream();
  66  |   const chunks: Buffer[] = [];
  67  |   for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  68  |   const backup = Buffer.concat(chunks);
  69  | 
  70  |   await page.getByText("Product designer").click();
  71  |   await page
  72  |     .getByRole("button", { name: "Delete application" })
  73  |     .first()
  74  |     .click();
  75  |   await page
  76  |     .getByRole("alertdialog")
  77  |     .getByRole("button", { name: "Delete application" })
  78  |     .click();
  79  |   await expect(page.getByText("Product designer")).toHaveCount(0);
  80  | 
  81  |   await page.getByRole("button", { name: /Import \/ Export/ }).click();
  82  |   await page.getByRole("menuitem", { name: "Import applications" }).click();
  83  |   await page.locator('input[type="file"]').setInputFiles({
  84  |     name: "applications.json",
  85  |     mimeType: "application/json",
  86  |     buffer: backup,
  87  |   });
  88  |   await page.getByRole("button", { name: "Preview import" }).click();
  89  |   await page.getByRole("button", { name: "Import 1" }).click();
  90  |   await expect(page.getByText("Product designer")).toBeVisible();
  91  | 
  92  |   await page.getByText("Product designer").click();
  93  |   await page
  94  |     .getByRole("button", { name: "Delete application" })
  95  |     .first()
  96  |     .click();
  97  |   await page
  98  |     .getByRole("alertdialog")
  99  |     .getByRole("button", { name: "Delete application" })
  100 |     .click();
  101 |   await expect(page.getByText("Your workspace is ready")).toBeVisible();
  102 | });
  103 | 
```