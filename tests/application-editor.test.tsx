import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApplicationEditor } from "@/components/application-editor";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("ApplicationEditor", () => {
  it("validates identity fields and creates a role-only application", async () => {
    const onSave = vi.fn();
    render(<ApplicationEditor application={null} onSave={onSave} />);

    fireEvent.click(screen.getByRole("button", { name: "Add application" }));
    expect(await screen.findByText("Enter a company or role")).toBeVisible();
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole("textbox", { name: "Role" }), {
      target: { value: "Product designer" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add application" }));
    await waitFor(() => expect(onSave).toHaveBeenCalledOnce());
    expect(onSave.mock.calls[0][0]).toMatchObject({
      company: "",
      role: "Product designer",
      stage: "Applied",
    });
  });
});
