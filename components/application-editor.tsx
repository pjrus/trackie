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

/** Header, form and footer share one centred column inside full-width chrome. */
const CONTENT_COLUMN = "mx-auto w-full max-w-3xl";

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

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-5 border-t pt-6 md:grid-cols-[150px_1fr]">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">
          {eyebrow}
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold">{title}</h3>
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
      <div className="mx-auto flex min-h-screen w-full flex-col">
        {/* Full-width bar. The arrow is taken out of flow at the left edge so
            the title lines up with the centred content column below it. */}
        <header className="sticky top-0 z-20 border-b bg-card px-5 py-5 sm:px-8">
          <div className="relative">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute left-0 top-0.5"
              onClick={requestClose}
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="size-4" />
            </Button>
            {/* lg:pl-8 matches the form's own inset so the title and the first
                field share a left edge once the column is centred. */}
            <div className={`${CONTENT_COLUMN} pl-11 lg:pl-8`}>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-primary">
                {application ? "Application record" : "New application"}
              </p>
              <h1 className="mt-1 font-display text-2xl font-semibold">
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
          <Section eyebrow="01" title="Overview">
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
          <Section eyebrow="02" title="Progress">
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
          <Section eyebrow="03" title="Details">
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
                    className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
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
          <Section eyebrow="04" title="Activity">
            <div className="space-y-3 sm:col-span-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Keep a lightweight record of conversations and milestones.
                </p>
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
                  className="grid gap-2 rounded-md border bg-card p-3 sm:grid-cols-[150px_1fr_auto]"
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
        <footer className="sticky bottom-0 z-20 border-t bg-card px-5 py-4 sm:px-8">
          <div
            className={`${CONTENT_COLUMN} flex items-center justify-between gap-3`}
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
