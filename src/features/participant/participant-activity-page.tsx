import { DeliveryInfo } from "@/features/learning/delivery-fields";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  CalendarDays,
  Info,
  ArrowUpRight,
} from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { ActivityCover } from "@/features/catalog/components/activity-cover";
import { CertificateDownload } from "@/features/certificates/certificate-download";
import { participantActivities } from "./participant-selectors";
import { EnrollmentStatus } from "./components/enrollment-status";
import { formatDate } from "@/lib/date";
export function ParticipantActivityPage() {
  const { state, users, user } = useDemo();
  const { activityId } = useParams();
  if (!user) return null;
  const item = participantActivities(state, users, user.id).find(
    (item) => item.activity.id === activityId,
  );
  if (!item)
    return (
      <div className="participant-page">
        <h1 tabIndex={-1} className="participant-missing-title">
          Atividade não encontrada no seu espaço
        </h1>
        <EmptyState
          title="Esta atividade não está nas suas inscrições."
          description="Você pode consultar suas atividades ou explorar o catálogo para encontrar algo novo."
        >
          <Button asChild variant="outline">
            <Link to="/participante/inscricoes">Ver minhas inscrições</Link>
          </Button>
        </EmptyState>
      </div>
    );
  const { activity, enrollment, instructor } = item;
  return (
    <article className="participant-page participant-activity">
      <Link to="/participante/inscricoes" className="back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Minhas inscrições
      </Link>
      <div className="participant-activity-heading">
        <span className="eyebrow">
          {activity.thematicArea} · {activity.activityType}
        </span>
        <h1 tabIndex={-1}>{activity.title}</h1>
        <EnrollmentStatus status={enrollment.status} />
      </div>
      <ActivityCover area={activity.thematicArea} />
      <div className="participation-summary">
        <span>
          <Clock3 size={17} aria-hidden="true" />
          {activity.hours} horas · {activity.format}
        </span>
        <span>
          <CalendarDays size={17} aria-hidden="true" />
          Inscrição em {formatDate(enrollment.enrolledAt)}
        </span>
      </div>
      <DeliveryInfo activity={activity} showLink />
      {activity.delivery && (
        <Button asChild>
          <Link
            to={`/participante/atividades/${activity.id}/${activity.format === "Remota assíncrona" ? "aulas" : "frequencia"}`}
          >
            {activity.format === "Remota assíncrona"
              ? "Assistir videoaulas"
              : "Acompanhar frequência"}
          </Link>
        </Button>
      )}
      <section className="participation-state">
        <h2>
          {enrollment.status === "Concluída"
            ? "Um aprendizado para levar com você."
            : "Você faz parte desta troca."}
        </h2>
        <p>
          {enrollment.status === "Concluída"
            ? `Conclusão registrada em ${formatDate(enrollment.completedAt)}. As ${activity.hours} horas desta atividade já aparecem no seu histórico demonstrativo.`
            : "Sua inscrição está confirmada na demonstração. A conclusão será registrada pelo Instrutor responsável após os critérios serem atendidos."}
        </p>
        {enrollment.status === "Concluída" ? (
          <CertificateDownload
            enrollmentId={enrollment.id}
            activityTitle={activity.title}
          />
        ) : (
          <div className="participant-guidance">
            <Info size={17} aria-hidden="true" />
            <p>
              A confirmação de conclusão é uma responsabilidade do Instrutor.
              Não é necessário marcar a atividade como concluída por aqui.
            </p>
          </div>
        )}
      </section>
      <section className="detail-section">
        <p className="eyebrow">SOBRE A ATIVIDADE</p>
        <h2>O que aprendemos juntos</h2>
        <p>{activity.syllabus}</p>
        <p className="participant-instructor-note">
          Com <strong>{instructor.name}</strong> · Instrutor fictício
        </p>
        <Link className="text-link" to={`/atividades/${activity.id}`}>
          Ver detalhes no catálogo
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </section>
      <p className="institutional-caption">
        O registro e os comprovantes do MindShare não garantem o reconhecimento
        de horas complementares pela UFC.
      </p>
    </article>
  );
}
