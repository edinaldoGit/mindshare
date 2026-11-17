import { Link } from "react-router-dom";
import { FileText, ArrowUpRight, Info } from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { ParticipantHeader } from "@/features/participant/components/participant-header";
import { completedActivities } from "@/features/participant/participant-selectors";
import { CertificateDownload } from "./certificate-download";
import { formatDate } from "@/lib/date";
export function CertificatesPage() {
  const { state, users, user } = useDemo();
  if (!user) return null;
  const items = completedActivities(state, users, user.id);
  return (
    <div className="participant-page">
      <ParticipantHeader
        eyebrow="CADA EXPERIÊNCIA DEIXA UMA MARCA"
        title="Meus comprovantes"
        description="Guarde um registro dos aprendizados que você concluiu."
      />
      <div className="institutional-notice">
        <Info size={19} aria-hidden="true" />
        <p>
          Todos os arquivos são comprovantes demonstrativos do protótipo
          MindShare. Sua emissão não garante o reconhecimento da carga horária
          pela UFC.
        </p>
      </div>
      <p className="result-note">
        {items.length}{" "}
        {items.length === 1
          ? "comprovante disponível"
          : "comprovantes disponíveis"}{" "}
        · Somente atividades concluídas
      </p>
      {items.length ? (
        <div className="certificates-grid">
          {items.map(({ activity, enrollment, instructor }) => (
            <article className="certificate-card" key={enrollment.id}>
              <div className="certificate-card-header">
                <span>
                  <FileText size={28} strokeWidth={1.4} aria-hidden="true" />
                </span>
                <span className="badge">PDF demonstrativo</span>
              </div>
              <p className="eyebrow">{activity.thematicArea}</p>
              <h2>{activity.title}</h2>
              <p className="certificate-instructor">Com {instructor.name}</p>
              <dl>
                <div>
                  <dt>Carga horária</dt>
                  <dd>{activity.hours} horas</dd>
                </div>
                <div>
                  <dt>Conclusão</dt>
                  <dd>{formatDate(enrollment.completedAt!)}</dd>
                </div>
              </dl>
              <CertificateDownload
                enrollmentId={enrollment.id}
                activityTitle={activity.title}
              />
              <Link
                className="text-link"
                to={`/participante/atividades/${activity.id}`}
              >
                Ver atividade
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Seus próximos aprendizados vão aparecer aqui."
          description="Comprovantes ficam disponíveis após a conclusão ser confirmada pelo Instrutor."
        >
          <Button asChild variant="outline">
            <Link to="/participante/inscricoes">Ver minhas inscrições</Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}
