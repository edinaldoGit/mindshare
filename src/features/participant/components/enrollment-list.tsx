import { ArrowUpRight, Clock3, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import type { ParticipantActivity } from "../participant-selectors";
import { EnrollmentStatus } from "./enrollment-status";
import { formatDate } from "@/lib/date";
export function EnrollmentList({ items }: { items: ParticipantActivity[] }) {
  return (
    <div className="enrollment-list">
      {items.map(({ activity, enrollment, instructor }) => (
        <article key={enrollment.id} className="enrollment-row">
          <span className="enrollment-row-icon" aria-hidden="true">
            <BookOpen size={22} strokeWidth={1.5} />
          </span>
          <div className="enrollment-row-copy">
            <p className="enrollment-area">{activity.thematicArea}</p>
            <h3>
              <Link to={`/participante/atividades/${activity.id}`}>
                {activity.title}
              </Link>
            </h3>
            <p className="enrollment-instructor">Com {instructor.name}</p>
          </div>
          <div className="enrollment-row-meta">
            <EnrollmentStatus status={enrollment.status} />
            <span>
              <Clock3 size={13} aria-hidden="true" />
              {activity.hours} horas
            </span>
            <small>
              {enrollment.status === "Concluída"
                ? `Conclusão em ${formatDate(enrollment.completedAt)}`
                : `Inscrição em ${formatDate(enrollment.enrolledAt)}`}
            </small>
          </div>
          <ArrowUpRight
            className="enrollment-row-arrow"
            size={18}
            aria-hidden="true"
          />
        </article>
      ))}
    </div>
  );
}
