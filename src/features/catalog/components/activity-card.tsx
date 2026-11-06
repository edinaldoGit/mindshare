import { ArrowUpRight, Clock3, MapPin, Monitor } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useDemo } from "@/app/providers/demo-context";
import type { Activity } from "@/types/domain";
import { availableSeats } from "../catalog-selectors";
import { ActivityCover } from "./activity-cover";
export function ActivityCard({ activity }: { activity: Activity }) {
  const { enrollments, users, user } = useDemo();
  const location = useLocation();
  const enrollment = user
    ? enrollments.find(
        (item) =>
          item.activityId === activity.id && item.participantId === user.id,
      )
    : undefined;
  const available = availableSeats(activity, enrollments);
  const instructor = users.find((user) => user.id === activity.instructorId);
  const FormatIcon = activity.format === "Remoto" ? Monitor : MapPin;
  return (
    <article className="activity-card">
      <ActivityCover area={activity.thematicArea} />
      <div className="activity-card-content">
        <div className="card-kicker">
          <span>{activity.thematicArea}</span>
          <span>{activity.activityType}</span>
        </div>
        <h3>
          <Link
            to={`/atividades/${activity.id}`}
            state={{
              catalogSearch:
                location.pathname === "/catalogo" ? location.search : "",
            }}
          >
            {activity.title}
            <span className="sr-only"> — ver detalhes</span>
          </Link>
        </h3>
        <p className="card-summary">{activity.summary}</p>
        <div className="activity-meta">
          <span>
            <Clock3 size={14} aria-hidden="true" />
            {activity.hours} horas
          </span>
          <span>
            <FormatIcon size={14} aria-hidden="true" />
            {activity.format}
          </span>
        </div>
        <div className="card-instructor">
          <span className="avatar" aria-hidden="true">
            {instructor?.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </span>
          <span>{instructor?.name ?? "Instrutor de exemplo"}</span>
          <span className={`seats-badge ${available === 0 ? "is-full" : ""}`}>
            {available
              ? `${available} ${available === 1 ? "vaga" : "vagas"}`
              : "Sem vagas"}
          </span>
        </div>
        <div className="card-bottom">
          <span>
            {enrollment
              ? `Sua participação: ${enrollment.status}`
              : "Atividade demonstrativa"}
          </span>
          <ArrowUpRight size={17} aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
