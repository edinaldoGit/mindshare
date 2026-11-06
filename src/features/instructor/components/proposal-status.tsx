import type { Activity } from "@/types/domain";
export function ProposalStatus({ status }: { status: Activity["status"] }) {
  return <span className={`instructor-status status-${status.replaceAll(" ", "-").replaceAll("á", "a")}`}><span aria-hidden="true" />{status}</span>;
}
