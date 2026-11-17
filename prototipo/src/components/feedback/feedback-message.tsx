import { CircleAlert, Info } from "lucide-react";
import type { ReactNode } from "react";
export function FeedbackMessage({
  children,
  error = false,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  const Icon = error ? CircleAlert : Info;
  return (
    <div
      className={`feedback-message ${error ? "is-error" : ""}`}
      role={error ? "alert" : "status"}
    >
      <Icon size={18} aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
