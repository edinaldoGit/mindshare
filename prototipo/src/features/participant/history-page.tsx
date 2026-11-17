import { Link } from "react-router-dom";
import { Clock3, Info } from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { CertificateDownload } from "@/features/certificates/certificate-download";
import {
  completedActivities,
  participantSummary,
} from "./participant-selectors";
import { ParticipantHeader } from "./components/participant-header";
import { HoursSummary } from "./components/hours-summary";
import { formatDate } from "@/lib/date";
export function HistoryPage() {
  const { state, users, user } = useDemo();
  if (!user) return null;
  const completed = completedActivities(state, users, user.id);
  const summary = participantSummary(state, users, user.id);
  return (
    <div className="participant-page">
      <ParticipantHeader
        eyebrow="APRENDIZADOS QUE FICAM"
        title="Seu tempo, em conhecimento."
        description="Consulte as horas das atividades cuja conclusão já foi registrada."
      />
      <HoursSummary hours={summary.hours} completed={summary.completed} />
      <div className="institutional-notice">
        <Info size={19} aria-hidden="true" />
        <p>
          O registro de horas no MindShare não substitui os procedimentos
          oficiais da UFC para reconhecimento de atividades complementares.
        </p>
      </div>
      <p className="seed-notice">
        As conclusões iniciais são exemplos fictícios preparados para a
        demonstração. Novas conclusões são confirmadas pelo Instrutor
        responsável pela atividade.
      </p>
      {completed.length ? (
        <section className="history-list" aria-label="Atividades concluídas">
          {completed.map(({ enrollment, activity, instructor }) => (
            <article key={enrollment.id} className="history-item">
              <div className="history-marker" aria-hidden="true">
                <Clock3 size={18} />
              </div>
              <div className="history-item-copy">
                <p className="eyebrow">
                  CONCLUSÃO EM {formatDate(enrollment.completedAt!)}
                </p>
                <h2>
                  <Link to={`/participante/atividades/${activity.id}`}>
                    {activity.title}
                  </Link>
                </h2>
                <p>Com {instructor.name}</p>
                <span>
                  {activity.hours} horas · {activity.thematicArea}
                </span>
              </div>
              <CertificateDownload
                enrollmentId={enrollment.id}
                activityTitle={activity.title}
              />
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="Seu histórico começa com uma conclusão."
          description="As horas aparecerão aqui quando o Instrutor confirmar a conclusão de uma atividade."
        >
          <Button asChild variant="outline">
            <Link to="/participante/inscricoes">
              Consultar minhas inscrições
            </Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
