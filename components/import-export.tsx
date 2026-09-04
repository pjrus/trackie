"use client";
import { type ReactNode, useRef, useState } from "react";
import { Calendar, FileJson, FileSpreadsheet, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  createCSV,
  createICS,
  createJSON,
  downloadText,
  parseCSVImport,
  parseJSONImport,
  SAMPLE_CSV,
} from "@/lib/import-export";
import type { Application, ImportPreview } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input, Label, Textarea } from "@/components/ui/form-controls";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ImportExport({
  applications,
  onImport,
  trigger,
}: {
  applications: Application[];
  onImport: (apps: Application[]) => void;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"csv" | "json">("json");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const exportFile = (type: "csv" | "json" | "ics") => {
    if (type === "csv")
      downloadText(
        createCSV(applications),
        "applications.csv",
        "text/csv;charset=utf-8",
      );
    if (type === "json")
      downloadText(
        createJSON(applications),
        "applications.json",
        "application/json",
      );
    if (type === "ics")
      downloadText(
        createICS(applications),
        "job-deadlines.ics",
        "text/calendar",
      );
    toast.success(
      `Exported ${applications.length} application${applications.length === 1 ? "" : "s"} as ${type.toUpperCase()}.`,
    );
  };
  const inspect = () =>
    setPreview(
      mode === "csv" ? parseCSVImport(content) : parseJSONImport(content),
    );
  const changeMode = (value: string) => {
    if (value === "csv" || value === "json") {
      setMode(value);
      setContent("");
      setPreview(null);
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {trigger}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Export</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => exportFile("csv")}>
            <FileSpreadsheet className="size-4" />
            CSV spreadsheet
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => exportFile("json")}>
            <FileJson className="size-4" />
            JSON backup
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => exportFile("ics")}>
            <Calendar className="size-4" />
            Calendar (.ics)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setOpen(true)}>
            <Upload className="size-4" />
            Import applications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Import applications</DialogTitle>
          <DialogDescription className="mt-1">
            Preview and validate a CSV or JSON file before adding valid records
            in one batch.
          </DialogDescription>
          <Tabs value={mode} onValueChange={changeMode} className="mt-5">
            <TabsList>
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="csv">CSV</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="mt-5 space-y-4">
            <div>
              <Label htmlFor="import-file">Upload {mode.toUpperCase()}</Label>
              <Input
                ref={fileRef}
                id="import-file"
                className="mt-2"
                type="file"
                accept={
                  mode === "csv" ? ".csv,text/csv" : ".json,application/json"
                }
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  file.text().then((text) => {
                    setContent(text);
                    setPreview(null);
                  });
                }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="import-content">Or paste content</Label>
                {mode === "csv" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setContent(SAMPLE_CSV);
                      setPreview(null);
                    }}
                  >
                    Use sample
                  </Button>
                ) : null}
              </div>
              <Textarea
                id="import-content"
                className="mt-2 min-h-40 font-mono text-xs"
                value={content}
                onChange={(event) => {
                  setContent(event.target.value);
                  setPreview(null);
                }}
                placeholder={
                  mode === "csv" ? "Company,Role…" : '[{"company":"…"}]'
                }
              />
            </div>
            {preview ? (
              <div
                className="rounded-md border bg-secondary/45 p-4"
                aria-live="polite"
              >
                <p className="font-semibold">
                  {preview.accepted.length} accepted · {preview.errors.length}{" "}
                  error{preview.errors.length === 1 ? "" : "s"}
                </p>
                {preview.accepted.length ? (
                  <ul className="mt-2 max-h-28 overflow-y-auto text-sm text-muted-foreground">
                    {preview.accepted.map((app) => (
                      <li key={app.id}>
                        {app.company || "No company"} — {app.role || "No role"}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {preview.errors.length ? (
                  <ul className="mt-3 text-sm text-destructive">
                    {preview.errors.map((error, index) => (
                      <li key={`${error.row}-${index}`}>
                        Row {error.row || "file"}: {error.message}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              {preview ? (
                <Button
                  disabled={!preview.accepted.length}
                  onClick={() => {
                    onImport(preview.accepted);
                    toast.success(
                      `Imported ${preview.accepted.length} application${preview.accepted.length === 1 ? "" : "s"}.`,
                    );
                    setOpen(false);
                    setContent("");
                    setPreview(null);
                  }}
                >
                  Import {preview.accepted.length}
                </Button>
              ) : (
                <Button disabled={!content.trim()} onClick={inspect}>
                  Preview import
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
