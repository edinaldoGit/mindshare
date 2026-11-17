import { Check, BookOpen } from "lucide-react";
import type { Enrollment } from "@/types/domain";
export function EnrollmentStatus({ status }: { status: Enrollment["status"] }) {
  const Icon = status === "Concluída" ? Check : BookOpen;
  return (
    <span
      className={`enrollment-status ${status === "Concluída" ? "is-completed" : ""}`}
    >
      <Icon size={13} aria-hidden="true" />
      {status}
    </span>
  );
}
