# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-layout.spec.ts >> mobile workspace and editor remain usable
- Location: tests/e2e/mobile-layout.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Trackie' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Trackie' })

```

```yaml
- main:
  - button "Toggle sidebar":
    - img
    - text: Toggle sidebar
  - heading "Kanban board" [level=1]
  - img
  - textbox "Search applications":
    - /placeholder: Search company, role, or tag…
  - button "Due this week"
  - button "Active only"
  - button "Filters":
    - img
    - text: Filters
  - main:
    - region "Applied":
      - heading "Applied" [level=2]
      - text: "1"
      - button "Move Local Co":
        - img
      - button "Local Co Analyst":
        - paragraph: Local Co
        - heading "Analyst" [level=3]
      - button "Application actions":
        - img
      - text: Medium
      - img
      - text: No deadline
    - region "Online Assessment":
      - heading "Online Assessment" [level=2]
      - text: 0 Drop an application here
    - region "Phone Screen":
      - heading "Phone Screen" [level=2]
      - text: 0 Drop an application here
    - region "Interview":
      - heading "Interview" [level=2]
      - text: 0 Drop an application here
    - region "Offer":
      - heading "Offer" [level=2]
      - text: 0 Drop an application here
    - region "Rejected":
      - heading "Rejected" [level=2]
      - text: 0 Drop an application here
    - region "Withdrawn":
      - heading "Withdrawn" [level=2]
      - text: 0 Drop an application here
    - status
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("mobile workspace and editor remain usable", async ({ page }, testInfo) => {
  4  |   test.skip(
  5  |     testInfo.project.name !== "mobile-chromium",
  6  |     "Mobile-only responsive check.",
  7  |   );
  8  |   await page.addInitScript(() => {
  9  |     localStorage.setItem(
  10 |       "jobApplications",
  11 |       JSON.stringify([{ id: "mobile", company: "Local Co", role: "Analyst" }]),
  12 |     );
  13 |   });
  14 |   await page.goto("/");
> 15 |   await expect(page.getByRole("heading", { name: "Trackie" })).toBeVisible();
     |                                                                ^ Error: expect(locator).toBeVisible() failed
  16 |   await page.getByRole("button", { name: "New application" }).click();
  17 | 
  18 |   const editor = page.getByRole("dialog");
  19 |   await expect(editor).toBeVisible();
  20 |   const box = await editor.boundingBox();
  21 |   const viewport = page.viewportSize();
  22 |   expect(box?.x).toBe(0);
  23 |   expect(box?.y).toBe(0);
  24 |   expect(Math.round(box?.width ?? 0)).toBe(viewport?.width);
  25 |   expect(Math.round(box?.height ?? 0)).toBe(viewport?.height);
  26 | 
  27 |   await page.getByRole("button", { name: "Cancel" }).click();
  28 |   const appliedColumn = page.getByRole("region", { name: "Applied" });
  29 |   const horizontallyScrollable = await appliedColumn.evaluate((element) => {
  30 |     const scrollContainer = element.parentElement?.parentElement;
  31 |     return Boolean(
  32 |       scrollContainer &&
  33 |         scrollContainer.scrollWidth > scrollContainer.clientWidth,
  34 |     );
  35 |   });
  36 |   expect(horizontallyScrollable).toBe(true);
  37 | });
  38 | 
```