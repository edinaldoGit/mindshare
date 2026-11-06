import { assignedTo } from "@/lib/demo/evolution";
import { DeliveryInfo } from "@/features/learning/delivery-fields";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCheck,
  MessageSquareText,
  X,
} from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
import { EmptyState } from "@/components/feedback/empty-state";
import { ProposalStatus } from "@/features/instructor/components/proposal-status";
import { formatDate } from "@/lib/date";
import { ProposalTimeline } from "./proposal-timeline";
import { DecisionDialog, type DecisionKind } from "./decision-dialog";
export function ProposalReviewPage() {
  const { activityId } = useParams();
  const {
    user,
    state,
    users,
    approveProposal,
    rejectProposal,
    requestAdjustments,
  } = useDemo();
  const activity = state.activities.find(
    (item) =>
      item.id === activityId &&
      item.status !== "Rascunho" &&
      assignedTo(state, user, item),
  );
  const [kind, setKind] = useState<DecisionKind | null>(null);
  const [feedback, setFeedback] = useState("");
  const resultFocus = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (feedback) resultFocus.current?.focus();
  }, [feedback]);
  if (!activity)
    return (
      <div className="instructor-page">
        <h1>Proposta indisponível</h1>
        <EmptyState
          title="Não encontramos esta proposta submetida"
          description="Consulte a fila para conhecer as propostas disponíveis para avaliação."
        >
          <Button asChild variant="outline">
            <Link to="/curadoria/propostas">Voltar à fila</Link>
          </Button>
        </EmptyState>
      </div>
    );
  const instructor = users.find((user) => user.id === activity.instructorId);
  const decision = activity.decisions.at(-1);
  const facts = [
    ["Instrutor", instructor?.name ?? "Discente demonstrativo"],
    [
      "Data da submissão mais recente",
      activity.submittedAt ? formatDate(activity.submittedAt) : "Não informada",
    ],
    ["Carga horária", `${activity.hours} horas`],
    ["Formato", activity.format],
    ["Categoria de horas complementares", activity.category],
    ["Número de vagas", String(activity.capacity)],
    ["Área temática", activity.thematicArea],
    ["Tipo de atividade", activity.activityType],
  ];
  function decide(reason: string) {
    if (!activity || !kind)
      return { ok: false, message: "Selecione uma decisão." };
    const result =
      kind === "Aprovada"
        ? approveProposal(activity.id)
        : kind === "Rejeitada"
          ? rejectProposal(activity.id, reason)
          : requestAdjustments(activity.id, reason);
    if (result.ok) setFeedback(result.message);
    return result;
  }
  return (
    <div className="instructor-page curation-page">
      <Link className="curation-back-link" to="/curadoria/propostas">
        <ArrowLeft size={15} aria-hidden="true" />
        Fila de propostas
      </Link>
      <header className="proposal-detail-heading curation-review-heading">
        <p className="eyebrow">LEITURA E DECISÃO · {activity.thematicArea}</p>
        <h1>{activity.title}</h1>
        <div className="curation-review-byline">
          <span>Proposta de {instructor?.name}</span>
          <ProposalStatus status={activity.status} />
        </div>
      </header>
      {feedback && (
        <div ref={resultFocus} tabIndex={-1} className="curation-result">
          <FeedbackMessage>{feedback}</FeedbackMessage>
        </div>
      )}
      <div className="proposal-detail-grid curation-review-grid">
        <article className="proposal-detail-body">
          <section className="proposal-detail-section curation-syllabus">
            <p className="eyebrow">A IDEIA EM DETALHES</p>
            <h2>Ementa da atividade</h2>
            <p>{activity.syllabus}</p>
          </section>
          <section className="proposal-detail-section">
            <p className="eyebrow">PARA ORGANIZAR A LEITURA</p>
            <h2>Informações da proposta</h2>
            <dl className="proposal-facts">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <DeliveryInfo activity={activity} showLink />
          <ProposalTimeline activity={activity} users={users} />
        </article>
        <aside
          className="proposal-detail-aside curation-decision-panel"
          aria-label="Decisão de curadoria"
        >
          <p className="eyebrow">SUA AVALIAÇÃO</p>
          <h2>
            {activity.status === "Em análise"
              ? "Qual é o próximo passo?"
              : "Decisão registrada"}
          </h2>
          {activity.status === "Em análise" ? (
            <>
              <p>
                Leia a proposta e escolha a decisão apropriada. Aprovar torna a
                atividade disponível no catálogo.
              </p>
              <div className="curation-actions">
                <Button onClick={() => setKind("Aprovada")}>
                  <CheckCheck size={17} aria-hidden="true" />
                  Aprovar proposta
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setKind("Ajustes solicitados")}
                >
                  <MessageSquareText size={17} aria-hidden="true" />
                  Solicitar ajustes
                </Button>
                <Button
                  variant="ghost"
                  className="curation-reject-action"
                  onClick={() => setKind("Rejeitada")}
                >
                  <X size={17} aria-hidden="true" />
                  Rejeitar proposta
                </Button>
              </div>
              <p className="proposal-detail-note">
                Justificativas e solicitações ficam visíveis ao Instrutor. As
                decisões são locais e demonstrativas.
              </p>
            </>
          ) : (
            <>
              <p>
                {activity.status === "Aprovada"
                  ? "A atividade está disponível no catálogo e pode receber inscrições."
                  : activity.status === "Ajustes solicitados"
                    ? "O Instrutor pode revisar a proposta e reenviar. Uma nova decisão ficará disponível somente após o reenvio."
                    : "A proposta não será publicada. A justificativa está disponível ao Instrutor."}
              </p>
              {decision && (
                <div className="curation-recorded-decision">
                  <ProposalStatus status={decision.outcome} />
                  <time dateTime={decision.decidedAt}>
                    {formatDate(decision.decidedAt)}
                  </time>
                  {"reason" in decision && <p>{decision.reason}</p>}
                </div>
              )}
              {activity.status === "Aprovada" && (
                <Button asChild variant="outline" className="full-width">
                  <Link to={`/atividades/${activity.id}`}>
                    Ver no catálogo <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </Button>
              )}
              <Link className="proposal-card-link" to="/curadoria/propostas">
                Continuar na fila <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </>
          )}
        </aside>
      </div>
      {kind && (
        <DecisionDialog
          activity={activity}
          kind={kind}
          onClose={() => setKind(null)}
          onDecide={decide}
        />
      )}
    </div>
  );
}
