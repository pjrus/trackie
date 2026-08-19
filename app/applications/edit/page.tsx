"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import type { ApplicationFormValues } from "@/lib/applications";
import { useApplications } from "@/hooks/use-applications";
import { ApplicationEditor } from "@/components/application-editor";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/display";

function EditorSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-4 h-40 w-full" />
      <Skeleton className="mt-4 h-40 w-full" />
    </div>
  );
}

function ApplicationEditorPage() {
  const id = useSearchParams().get("id");
  const router = useRouter();
  const { applications, isLoaded, updateApplication, deleteApplication } =
    useApplications();

  if (!isLoaded) return <EditorSkeleton />;

  const application = applications.find((app) => app.id === id) ?? null;
  if (!application) {
    return (
      <div className="mx-auto grid min-h-screen max-w-3xl place-items-center px-5 text-center sm:px-8">
        <div>
          <h1 className="font-display text-xl font-semibold">
            Application not found
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This record may have been deleted from this browser.
          </p>
          <Button className="mt-5" onClick={() => router.push("/")}>
            Back to dashboard
          </Button>
        </div>
      </div>
    );
  }

  const save = (values: ApplicationFormValues) => {
    updateApplication(application.id, values);
    toast.success("Application updated");
    router.push("/");
  };
  const remove = () => {
    deleteApplication(application.id);
    toast.success("Application deleted");
    router.push("/");
  };

  return (
    <ApplicationEditor application={application} onSave={save} onDelete={remove} />
  );
}

/** `useSearchParams` needs a Suspense boundary so the shell can prerender. */
export default function Page() {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <ApplicationEditorPage />
    </Suspense>
  );
}
