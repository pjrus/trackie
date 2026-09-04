"use client";
import { type ReactNode } from "react";
import { useTheme } from "next-themes";
import { Laptop, Moon, Sun } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/controls";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Laptop },
] as const;

export function SettingsPanel({ trigger }: { trigger: ReactNode }) {
  const { theme, setTheme } = useTheme();
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>
          Preferences for this browser. More workspace settings will land
          here over time.
        </DialogDescription>
        <div className="mt-6 space-y-6">
          <section>
            <h3 className="text-sm font-semibold">Appearance</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose how Trackie looks on this device.
            </p>
            <ToggleGroup
              type="single"
              value={theme}
              onValueChange={(value) => value && setTheme(value)}
              className="mt-3 inline-flex rounded-md border border-border bg-muted p-1"
            >
              {THEMES.map(({ value, label, icon: Icon }) => (
                <ToggleGroupItem key={value} value={value} aria-label={label}>
                  <Icon className="size-4" />
                  {label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </section>
          <section>
            <h3 className="text-sm font-semibold">Privacy</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Trackie has no account or server. Every application, filter and
              preference stays in this browser&rsquo;s local storage.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
