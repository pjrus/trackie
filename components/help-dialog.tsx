"use client";
import { useState } from "react";
import { Check, Copy, HelpCircle } from "lucide-react";
import { SAMPLE_CSV } from "@/lib/import-export";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const prompts = [
  {
    title: "Extract from a job advert",
    text: "Turn the job advert below into one Trackie JSON application. Include company, role, industry, type, deadlines, location, salary, jobUrl, notes, whyApplied, tags, confidence, referral and referrerName. Use empty strings when unknown and return JSON only.",
  },
  {
    title: "Prepare for an interview",
    text: "Using the application details below, create a concise interview plan: company themes to research, five likely questions, five thoughtful questions to ask, and a 30-minute preparation schedule. Use Australian English.",
  },
  {
    title: "Write a follow-up",
    text: "Draft a warm, concise follow-up email for the job application below. Mention the latest timeline activity, reaffirm interest without sounding pushy, and include a clear subject line.",
  },
];

export function HelpDialog() {
  const [copied, setCopied] = useState("");
  const copy = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1500);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open help">
          <HelpCircle className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogTitle>Guide & templates</DialogTitle>
        <DialogDescription>
          Practical help for using Trackie and keeping your browser-only data
          safe.
        </DialogDescription>
        <Tabs defaultValue="guide">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="guide">Guide</TabsTrigger>
            <TabsTrigger value="prompts">AI prompts</TabsTrigger>
            <TabsTrigger value="csv">CSV format</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
          </TabsList>
          <TabsContent
            value="guide"
            className="space-y-4 text-sm text-muted-foreground"
          >
            <p>
              Trackie keeps every record in this browser. Create an application,
              move cards between stages, filter the workspace, and export a JSON
              backup regularly.
            </p>
            <ol className="grid gap-3 sm:grid-cols-3">
              <li className="rounded-md border p-4">
                <strong className="block text-foreground">1. Capture</strong>Add
                the role, company and next deadline.
              </li>
              <li className="rounded-md border p-4">
                <strong className="block text-foreground">2. Progress</strong>
                Drag a card or use its action menu.
              </li>
              <li className="rounded-md border p-4">
                <strong className="block text-foreground">3. Back up</strong>
                Export JSON to preserve every field.
              </li>
            </ol>
          </TabsContent>
          <TabsContent value="prompts" className="space-y-3">
            {prompts.map((prompt) => (
              <div className="rounded-md border p-4" key={prompt.title}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{prompt.title}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copy(prompt.title, prompt.text)}
                  >
                    {copied === prompt.title ? (
                      <Check className="size-4" />
                    ) : (
                      <Copy className="size-4" />
                    )}
                    {copied === prompt.title ? "Copied" : "Copy"}
                  </Button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {prompt.text}
                </p>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="csv">
            <p className="mb-3 text-sm text-muted-foreground">
              The first row is the header. Tags are separated with semicolons;
              dates use YYYY-MM-DD.
            </p>
            <pre className="overflow-x-auto rounded-md border bg-secondary p-4 text-xs">
              {SAMPLE_CSV}
            </pre>
            <Button
              className="mt-3"
              size="sm"
              variant="secondary"
              onClick={() => copy("csv", SAMPLE_CSV)}
            >
              {copied === "csv" ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              Copy sample
            </Button>
          </TabsContent>
          <TabsContent value="faq">
            <Accordion type="single" collapsible>
              <AccordionItem value="storage">
                <AccordionTrigger>Where is my data stored?</AccordionTrigger>
                <AccordionContent>
                  Only in this browser’s localStorage. Trackie has no account,
                  database or API.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="clear">
                <AccordionTrigger>
                  What happens if I clear browser data?
                </AccordionTrigger>
                <AccordionContent>
                  Your applications may be deleted. Export a JSON backup first.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="devices">
                <AccordionTrigger>Can I use multiple devices?</AccordionTrigger>
                <AccordionContent>
                  Export JSON on one device and import it on another. There is
                  no automatic syncing.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="move">
                <AccordionTrigger>
                  How can I move a card without dragging?
                </AccordionTrigger>
                <AccordionContent>
                  Open the three-dot action menu on any card and choose a
                  destination stage.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
