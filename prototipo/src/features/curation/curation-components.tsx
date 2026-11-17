import { ArrowRight, CalendarDays, Clock3, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProposalStatus } from "@/features/instructor/components/proposal-status";
import { formatDate } from "@/lib/date";
import type { CurationEntry, DecisionEntry } from "./curation-selectors";
export function PendingProposalCard({
  entry,
  first = false,
}: {
  entry: CurationEntry;
  first?: boolean;
}) {
  const { activity, instructor } = entry;
  return (
    <article
      className={`proposal-card curation-proposal-card ${first ? "is-first" : ""}`}
    >
      <div className="proposal-card-heading">
        <div>
          <p className="eyebrow">
            {activity.thematicArea} · {activity.activityType}
          </p>
          <h2>
            <Link to={`/curadoria/propostas/${activity.id}`}>
              {activity.title}
            </Link>
          </h2>
        </div>
        <ProposalStatus status={activity.status} />
      </div>
      <p className="proposal-card-summary">{activity.summary}</p>
      <div className="curation-card-facts">
        <span>
          <UserRound size={15} aria-hidden="true" />
          {instructor}
        </span>
        <span>
          <CalendarDays size={15} aria-hidden="true" />
          Enviada em{" "}
          {activity.submittedAt
            ? formatDate(activity.submittedAt)
            : "data não informada"}
        </span>
        <span>
          <Clock3 size={15} aria-hidden="true" />
          {activity.hours} h · {activity.format} · {activity.capacity} vagas
        </span>
      </div>
      <Button asChild variant="outline">
        <Link to={`/curadoria/propostas/${activity.id}`}>
          Analisar proposta <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </Button>
    </article>
  );
}
export function DecisionCard({ entry }: { entry: DecisionEntry }) {
  const { activity, decision, instructor, curator } = entry;
  return (
    <article className="proposal-card curation-history-card">
      <div className="proposal-card-heading">
        <div>
          <p className="eyebrow">DECISÃO EM {formatDate(decision.decidedAt)}</p>
          <h2>
            <Link to={`/curadoria/propostas/${activity.id}`}>
              {activity.title}
            </Link>
          </h2>
        </div>
        <ProposalStatus status={decision.outcome} />
      </div>
      <p className="curation-history-author">
        Instrutor: {instructor} · Curadoria: {curator}
      </p>
      {"reason" in decision && (
        <p className="curation-decision-excerpt">{decision.reason}</p>
      )}
      <div className="curation-history-footer">
        <span>Situação atual: {activity.status}</span>
        <Link
          className="proposal-card-link"
          to={`/curadoria/propostas/${activity.id}`}
        >
          Consultar proposta <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
