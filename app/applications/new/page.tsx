"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ApplicationFormValues } from "@/lib/applications";
import { useApplications } from "@/hooks/use-applications";
import { ApplicationEditor } from "@/components/application-editor";

export default function NewApplicationPage() {
  const router = useRouter();
  const { addApplications } = useApplications();

  const save = (values: ApplicationFormValues) => {
    addApplications([values]);
    toast.success("Application added");
    router.push("/");
  };

  return <ApplicationEditor application={null} onSave={save} />;
}
