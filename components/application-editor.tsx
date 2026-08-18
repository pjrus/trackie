"use client";

import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CalendarPlus,
  Plus,
  Save,
  Tag,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  applicationFormSchema,
  EMPTY_APPLICATION,
  type ApplicationFormValues,
} from "@/lib/applications";
import {
  EMPLOYMENT_TYPES,
  INDUSTRIES,
  PRIORITIES,
  STAGES,
  type Application,
} from "@/lib/types";
import { newId } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
} from "@/components/ui/controls";
import { Input, Label, Textarea } from "@/components/ui/form-controls";

/**
 * Header, form and footer share one centred column inside full-width chrome:
 * roughly two thirds of the screen, going full width once there is no room to
 * give away.
 */
const CONTENT_COLUMN = "mx-auto w-full lg:w-2/3";

function Field({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

/**
 * Sections are categories, not steps — the form can be filled in any order — so
 * they are named and described rather than numbered.
 */
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-5 border-t pt-7 md:grid-cols-[190px_1fr] md:gap-8">
      <div className="md:pt-0.5">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function ControlledSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  label: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem value={option} key={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ApplicationEditor({
  application,
  onSave,
  onDelete,
}: {
  application: Application | null;
  onSave: (values: ApplicationFormValues) => void;
  onDelete?: () => void;
}) {
  const router = useRouter();
  const [discardOpen, setDiscardOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [tagDraft, setTagDraft] = useState("");
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: application
      ? {
          company: application.company,
          role: application.role,
          industry: application.industry,
          type: application.type,
          stage: application.stage,
          priority: application.priority,
          confidence: application.confidence,
          applicationDeadline: application.applicationDeadline,
          nextStepDeadline: application.nextStepDeadline,
          nextStepDescription: application.nextStepDescription,
          location: application.location,
          salary: application.salary,
          jobUrl: application.jobUrl,
          notes: application.notes,
          whyApplied: application.whyApplied,
          tags: application.tags,
          links: application.links,
          referral: application.referral,
          referrerName: application.referrerName,
          timeline: application.timeline,
        }
      : EMPTY_APPLICATION,
  });
  const links = useFieldArray({ control: form.control, name: "links" });
  const timeline = useFieldArray({ control: form.control, name: "timeline" });
  const tags = useWatch({ control: form.control, name: "tags" });
  const referral = useWatch({ control: form.control, name: "referral" });

  useEffect(() => {
    document.title = application
      ? `${application.company || "Untitled"} — ${application.role || "Open role"} · Trackie`
      : "Add an opportunity · Trackie";
  }, [application]);

  const requestClose = () =>
    form.formState.isDirty ? setDiscardOpen(true) : router.push("/");
  const addTag = () => {
    const tag = tagDraft.trim();
    const current = form.getValues("tags");
    if (
      tag &&
      !current.some((item) => item.toLowerCase() === tag.toLowerCase())
    ) {
      form.setValue("tags", [...current, tag], {
        shouldDirty: true,
        shouldValidate: true,
      });
      setTagDraft("");
    } else if (tag)
      form.setError("tags", { message: "That tag is already added" });
  };
  const submit = form.handleSubmit((values) => {
    onSave(values);
    form.reset(values);
  });

  return (
    <>
      <div className="mx-auto flex min-h-screen w-full flex-col bg-card">
        {/* Full-width bar. The arrow is taken out of flow at the left edge so
            the title lines up with the centred content column below it. */}
        {/* No padding on the bar itself: the column measures its share of the
            full width, exactly as the form below does. */}
        <header className="sticky top-0 z-20 border-b bg-card/90 py-5 backdrop-blur-md">
          <div className="relative">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute left-5 top-0.5 sm:left-8"
              onClick={requestClose}
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="size-4" />
            </Button>
            {/* Below lg the column is full width, so the title steps aside for
                the arrow; from lg it shares the form's inset. */}
            <div
              className={`${CONTENT_COLUMN} px-5 pl-16 sm:px-8 sm:pl-20 lg:pl-8`}
            >
              <p className="eyebrow text-primary">
                {application ? "Application record" : "New application"}
              </p>
              <h1 className="mt-1.5 font-display text-2xl font-semibold">
                {application
                  ? `${application.company || "Untitled"} — ${application.role || "Open role"}`
                  : "Add an opportunity"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Saved only in this browser. Company or role is required.
              </p>
            </div>
          </div>
        </header>
        <form
          id="application-form"
          onSubmit={submit}
          className={`${CONTENT_COLUMN} flex-1 space-y-7 px-5 py-6 sm:px-8`}
        >
          <Section
            title="Overview"
            description="Who you applied to, and what for."
          >
            <Field
              label="Company"
              error={form.formState.errors.company?.message}
            >
              <Input
                autoFocus
                aria-label="Company"
                {...form.register("company")}
                placeholder="e.g. Canva"
              />
            </Field>
            <Field label="Role" error={form.formState.errors.role?.message}>
              <Input
                aria-label="Role"
                {...form.register("role")}
                placeholder="e.g. Product designer"
              />
            </Field>
            <Controller
              control={form.control}
              name="industry"
              render={({ field }) => (
                <Field label="Industry">
                  <ControlledSelect
                    {...field}
                    options={INDUSTRIES}
                    label="Industry"
                  />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <Field label="Employment type">
                  <ControlledSelect
                    {...field}
                    options={EMPLOYMENT_TYPES}
                    label="Employment type"
                  />
                </Field>
              )}
            />
            <Field label="Location">
              <Input
                aria-label="Location"
                {...form.register("location")}
                placeholder="Melbourne, VIC"
              />
            </Field>
            <Field label="Salary / stipend">
              <Input
                aria-label="Salary or stipend"
                {...form.register("salary")}
                placeholder="$120k + super"
              />
            </Field>
          </Section>
          <Section
            title="Progress"
            description="Where this sits today and what happens next."
          >
            <Controller
              control={form.control}
              name="stage"
              render={({ field }) => (
                <Field label="Stage">
                  <ControlledSelect {...field} options={STAGES} label="Stage" />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="priority"
              render={({ field }) => (
                <Field label="Priority">
                  <ControlledSelect
                    {...field}
                    options={PRIORITIES}
                    label="Priority"
                  />
                </Field>
              )}
            />
            <Field
              label="Application deadline"
              error={form.formState.errors.applicationDeadline?.message}
            >
              <Input
                aria-label="Application deadline"
                type="date"
                {...form.register("applicationDeadline")}
              />
            </Field>
            <Field
              label="Next step deadline"
              error={form.formState.errors.nextStepDeadline?.message}
            >
              <Input
                aria-label="Next step deadline"
                type="date"
                {...form.register("nextStepDeadline")}
              />
            </Field>
            <Field label="Next step" className="sm:col-span-2">
              <Textarea
                aria-label="Next step"
                {...form.register("nextStepDescription")}
                placeholder="What happens next?"
              />
            </Field>
            <Controller
              name="confidence"
              control={form.control}
              render={({ field }) => (
                <Field
                  label={`Confidence — ${field.value}/5`}
                  className="sm:col-span-2"
                >
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[field.value]}
                    onValueChange={([value]) => field.onChange(value)}
                    aria-label="Confidence rating"
                  />
                </Field>
              )}
            />
          </Section>
          <Section
            title="Details"
            description="Links, notes and anything worth remembering later."
          >
            <Field
              label="Job posting URL"
              error={form.formState.errors.jobUrl?.message}
              className="sm:col-span-2"
            >
              <Input
                type="url"
                aria-label="Job posting URL"
                {...form.register("jobUrl")}
                placeholder="https://…"
              />
            </Field>
            <Field label="Why I applied" className="sm:col-span-2">
              <Textarea
                aria-label="Why I applied"
                {...form.register("whyApplied")}
                placeholder="What makes this opportunity compelling?"
              />
            </Field>
            <Field label="Notes" className="sm:col-span-2">
              <Textarea
                aria-label="Notes"
                {...form.register("notes")}
                placeholder="Interview notes, contacts, or context"
              />
            </Field>
            <Field
              label="Tags"
              error={form.formState.errors.tags?.message}
              className="sm:col-span-2"
            >
              <div className="flex gap-2">
                <Input
                  aria-label="New tag"
                  value={tagDraft}
                  onChange={(event) => setTagDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag"
                />
                <Button type="button" variant="secondary" onClick={addTag}>
                  <Tag className="size-4" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() =>
                      form.setValue(
                        "tags",
                        form.getValues("tags").filter((item) => item !== tag),
                        { shouldDirty: true },
                      )
                    }
                    className="border border-border bg-secondary px-2.5 py-1 text-xs font-medium transition-colors hover:border-destructive/40 hover:text-destructive"
                  >
                    {tag} <span aria-hidden>×</span>
                    <span className="sr-only">Remove {tag}</span>
                  </button>
                ))}
              </div>
            </Field>
            <div className="space-y-3 sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label>Additional links</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => links.append({ id: newId(), url: "" })}
                >
                  <Plus className="size-4" />
                  Add link
                </Button>
              </div>
              {links.fields.map((link, index) => (
                <div className="flex gap-2" key={link.id}>
                  <Input
                    type="url"
                    aria-label={`Additional link ${index + 1}`}
                    {...form.register(`links.${index}.url`)}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => links.remove(index)}
                    aria-label="Remove link"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Controller
              name="referral"
              control={form.control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="referral"
                    checked={field.value}
                    onCheckedChange={(value) => field.onChange(value === true)}
                  />
                  <Label htmlFor="referral">This was a referral</Label>
                </div>
              )}
            />
            {referral ? (
              <Field
                label="Referrer name"
                error={form.formState.errors.referrerName?.message}
              >
                <Input
                  aria-label="Referrer name"
                  {...form.register("referrerName")}
                />
              </Field>
            ) : null}
          </Section>
          <Section
            title="Activity"
            description="A running log of conversations and milestones."
          >
            <div className="space-y-3 sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label>Entries</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    timeline.prepend({
                      id: newId(),
                      date: new Date().toISOString().slice(0, 10),
                      description: "",
                    })
                  }
                >
                  <CalendarPlus className="size-4" />
                  Add entry
                </Button>
              </div>
              {timeline.fields.map((entry, index) => (
                <div
                  className="grid gap-2 rounded-lg border bg-background p-3 sm:grid-cols-[150px_1fr_auto]"
                  key={entry.id}
                >
                  <Input
                    type="date"
                    aria-label={`Activity date ${index + 1}`}
                    {...form.register(`timeline.${index}.date`)}
                  />
                  <Input
                    aria-label={`Activity description ${index + 1}`}
                    {...form.register(`timeline.${index}.description`)}
                    placeholder="Phone screen booked"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => timeline.remove(index)}
                    aria-label="Remove activity"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Section>
        </form>
        <footer className="sticky bottom-0 z-20 border-t bg-card/90 py-3.5 backdrop-blur-md">
          <div
            className={`${CONTENT_COLUMN} flex items-center justify-between gap-3 px-5 sm:px-8`}
          >
            <div>
              {application && onDelete ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              ) : null}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={requestClose}>
                Cancel
              </Button>
              <Button type="submit" form="application-form">
                <Save className="size-4" />
                {application ? "Save changes" : "Add application"}
              </Button>
            </div>
          </div>
        </footer>
      </div>
      <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
          <AlertDialogDescription>
            Your edits have not been saved.
          </AlertDialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialogCancel asChild>
              <Button variant="secondary">Keep editing</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={() => {
                  setDiscardOpen(false);
                  router.push("/");
                }}
              >
                Discard changes
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete this application?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the record from this browser and cannot be undone.
          </AlertDialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialogCancel asChild>
              <Button variant="secondary">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={onDelete}>
                Delete application
              </Button>
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
