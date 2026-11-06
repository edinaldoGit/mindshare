import type { Activity, User } from "@/types/domain";
import { proposalEvents } from "./curation-selectors";
import { formatDate } from "@/lib/date";
export function ProposalTimeline({
  activity,
  users,
}: {
  activity: Activity;
  users: User[];
}) {
  const events = proposalEvents(activity);
  return (
    <section className="proposal-detail-section">
      <p className="eyebrow">TRAJETÓRIA DA PROPOSTA</p>
      <h2>Histórico de análise</h2>
      {events.length ? (
        <ol className="curation-timeline">
          {events.map((event) => (
            <li key={event.id}>
              <span className="timeline-dot" aria-hidden="true" />
              <div>
                <strong>{event.title}</strong>
                <time dateTime={event.date}>
                  {formatDate(event.date)}
                  {event.curatorId &&
                    ` · ${users.find((user) => user.id === event.curatorId)?.name ?? "Professor Curador"}`}
                </time>
                {event.reason && <p>{event.reason}</p>}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p>Nenhum evento registrado.</p>
      )}
      <p className="curation-history-note">
        As decisões anteriores são preservadas. A data de envio exibida
        corresponde à submissão mais recente.
      </p>
    </section>
  );
}
