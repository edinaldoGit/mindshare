import { DeliveryInfo } from "@/features/learning/delivery-fields";
import { completionEligibility } from "@/lib/demo/evolution";
import { ProposalTimeline } from "@/features/curation/proposal-timeline";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  FileText,
  Plus,
  Users,
} from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
import { ConfirmationDialog } from "@/components/feedback/confirmation-dialog";
import { formatDate } from "@/lib/date";
import { canEditProposal } from "@/lib/policies";
import { ProposalStatus } from "./components/proposal-status";
import {
  activityParticipants,
  approvedInstructorActivities,
  availableSeats,
  instructorProposals,
  instructorSummary,
  proposalDecision,
} from "./instructor-selectors";
import { ProposalForm } from "./proposal-form";

function proposalDate(activity: {
  submittedAt?: string;
  createdAt?: string;
  decisions?: Array<{ decidedAt: string }>;
}) {
  const value =
    activity.decisions?.at(-1)?.decidedAt ??
    activity.submittedAt ??
    activity.createdAt;
  return value ? formatDate(value) : "Data não registrada";
}
function proposalDateLabel(activity: {
  submittedAt?: string;
  decisions: unknown[];
}) {
  return activity.decisions.length
    ? "Decidida"
    : activity.submittedAt
      ? "Enviada"
      : "Criada";
}
function ProposalCard({
  activity,
}: {
  activity: ReturnType<typeof instructorProposals>[number];
}) {
  const decision = proposalDecision(activity);
  return (
    <article className="proposal-card">
      <div className="proposal-card-heading">
        <div>
          <p className="eyebrow">
            {activity.thematicArea} · {activity.activityType}
          </p>
          <h2>
            <Link to={`/instrutor/propostas/${activity.id}`}>
              {activity.title}
            </Link>
          </h2>
        </div>
        <ProposalStatus status={activity.status} />
      </div>
      <p className="proposal-card-summary">{activity.summary}</p>
      {activity.status === "Ajustes solicitados" &&
        decision?.outcome === "Ajustes solicitados" && (
          <aside className="curation-feedback compact">
            <strong>A curadoria pediu ajustes</strong>
            <p>{decision.reason}</p>
          </aside>
        )}
      <div className="proposal-card-meta">
        <span>
          <Clock3 size={15} aria-hidden="true" />
          {activity.hours} {activity.hours === 1 ? "hora" : "horas"}
        </span>
        <span>{activity.format}</span>
        <span>{activity.capacity} vagas</span>
        <span>
          {proposalDateLabel(activity)} em {proposalDate(activity)}
        </span>
      </div>
      <Link
        className="proposal-card-link"
        to={`/instrutor/propostas/${activity.id}`}
      >
        Acompanhar proposta <ArrowUpRight size={15} aria-hidden="true" />
      </Link>
    </article>
  );
}

export function InstructorDashboard() {
  const { user, state } = useDemo();
  const proposals = instructorProposals(state, user?.id ?? "");
  const activities = approvedInstructorActivities(state, user?.id ?? "");
  const summary = instructorSummary(state, user?.id ?? "");
  return (
    <div className="instructor-page">
      <header className="instructor-page-heading instructor-welcome">
        <div>
          <p className="eyebrow">SUA IDEIA PODE VIRAR UMA TROCA</p>
          <h1>Compartilhe o que você sabe, {user?.name.split(" ")[0]}.</h1>
          <p>
            Acompanhe suas propostas e organize as atividades que você oferece.
          </p>
        </div>
        <Button asChild>
          <Link to="/instrutor/propostas/nova">
            <Plus size={16} aria-hidden="true" />
            Criar nova proposta
          </Link>
        </Button>
      </header>
      <section
        aria-label="Resumo das propostas e atividades"
        className="instructor-metrics"
      >
        <Metric
          icon={<FileText />}
          value={summary.proposals}
          label="Propostas cadastradas"
        />
        <Metric
          icon={<Clock3 />}
          value={summary.reviewing}
          label="Em análise"
        />
        <Metric
          icon={<Check />}
          value={summary.approved}
          label="Atividades aprovadas"
        />
        <Metric
          icon={<Users />}
          value={summary.participants}
          label="Participantes inscritos"
        />
      </section>
      <section className="instructor-section">
        <div className="instructor-section-heading">
          <div>
            <p className="eyebrow">ACOMPANHE A CURADORIA</p>
            <h2>Propostas recentes</h2>
          </div>
          <Link to="/instrutor/propostas">
            Ver todas <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        {proposals.length ? (
          <div className="proposal-list">
            {proposals.slice(0, 3).map((activity) => (
              <ProposalCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Sua próxima proposta começa aqui"
            description="Cadastre uma atividade para compartilhar seu conhecimento."
          >
            <Button asChild>
              <Link to="/instrutor/propostas/nova">Criar proposta</Link>
            </Button>
          </EmptyState>
        )}
      </section>
      <section className="instructor-section">
        <div className="instructor-section-heading">
          <div>
            <p className="eyebrow">APROVADAS PELA CURADORIA</p>
            <h2>Atividades em andamento</h2>
          </div>
          <Link to="/instrutor/atividades">
            Ver atividades <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        {activities.length ? (
          <div className="instructor-activity-grid">
            {activities.slice(0, 2).map((activity) => (
              <ActivityManagementCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma atividade aprovada ainda"
            description="Quando a curadoria aprovar uma proposta, a gestão de participantes aparecerá por aqui."
          />
        )}
      </section>
    </div>
  );
}
function Metric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="instructor-metric">
      <span className="instructor-metric-icon">{icon}</span>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export function InstructorProposalsPage() {
  const { user, state } = useDemo();
  const [filter, setFilter] = useState("Todas");
  const proposals = instructorProposals(state, user?.id ?? "");
  const shown =
    filter === "Todas"
      ? proposals
      : proposals.filter((item) => item.status === filter);
  const filters = [
    "Todas",
    "Rascunho",
    "Em análise",
    "Ajustes solicitados",
    "Aprovada",
    "Rejeitada",
  ];
  return (
    <div className="instructor-page">
      <header className="instructor-page-heading">
        <div>
          <p className="eyebrow">SUAS IDEIAS E SEUS PERCURSOS</p>
          <h1>Minhas propostas</h1>
          <p>Acompanhe a etapa atual de cada atividade que você propôs.</p>
        </div>
        <Button asChild>
          <Link to="/instrutor/propostas/nova">
            <Plus size={16} aria-hidden="true" />
            Nova proposta
          </Link>
        </Button>
      </header>
      <div className="proposal-filter">
        <label htmlFor="proposal-status-filter">Filtrar por situação</label>
        <select
          id="proposal-status-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          {filters.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <span>
          {shown.length} {shown.length === 1 ? "proposta" : "propostas"}
        </span>
      </div>
      {shown.length ? (
        <div className="proposal-list">
          {shown.map((activity) => (
            <ProposalCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            filter === "Todas"
              ? "Você ainda não tem propostas"
              : `Nenhuma proposta: ${filter}`
          }
          description={
            filter === "Todas"
              ? "Crie sua primeira proposta e acompanhe a resposta da curadoria."
              : "Quando uma proposta chegar a esta etapa, ela aparecerá aqui."
          }
        >
          <Button asChild>
            <Link to="/instrutor/propostas/nova">Criar nova proposta</Link>
          </Button>
        </EmptyState>
      )}
    </div>
  );
}

export function ProposalDetailPage() {
  const { id } = useParams();
  const { user, state, users, submitProposal } = useDemo();
  const location = useLocation();
  const navigate = useNavigate();
  const activity = state.activities.find(
    (item) => item.id === id && item.instructorId === user?.id,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  if (!activity)
    return (
      <section className="instructor-page">
        <EmptyState
          title="Proposta não encontrada"
          description="Não encontramos uma proposta sua com esse endereço."
        >
          <Button asChild variant="outline">
            <Link to="/instrutor/propostas">Minhas propostas</Link>
          </Button>
        </EmptyState>
      </section>
    );
  const decision = proposalDecision(activity);
  const canSubmit =
    activity.status === "Rascunho" || activity.status === "Ajustes solicitados";
  const ownActivity = activity;
  function submit() {
    const result = submitProposal(ownActivity.id);
    setFeedback(result.message);
    if (result.ok)
      navigate(`/instrutor/propostas/${ownActivity.id}`, {
        replace: true,
        state: { notice: result.message },
      });
  }
  const notice = (location.state as { notice?: string } | null)?.notice;
  return (
    <div className="instructor-page">
      <Link className="instructor-back-link" to="/instrutor/propostas">
        <ArrowRight size={15} aria-hidden="true" />
        Minhas propostas
      </Link>
      {(notice || feedback) && (
        <FeedbackMessage>{notice || feedback}</FeedbackMessage>
      )}
      <header className="proposal-detail-heading">
        <div>
          <p className="eyebrow">
            {activity.thematicArea} · {activity.activityType}
          </p>
          <h1>{activity.title}</h1>
          <ProposalStatus status={activity.status} />
        </div>
      </header>
      <div className="proposal-detail-grid">
        <article className="proposal-detail-body">
          <section className="proposal-detail-section">
            <p className="eyebrow">A PROPOSTA</p>
            <h2>Ementa</h2>
            <p>{activity.syllabus}</p>
          </section>
          <section className="proposal-detail-section">
            <p className="eyebrow">ORGANIZAÇÃO</p>
            <dl className="proposal-facts">
              <div>
                <dt>Carga horária</dt>
                <dd>
                  {activity.hours} {activity.hours === 1 ? "hora" : "horas"}
                </dd>
              </div>
              <div>
                <dt>Formato</dt>
                <dd>{activity.format}</dd>
              </div>
              <div>
                <dt>Categoria</dt>
                <dd>{activity.category}</dd>
              </div>
              <div>
                <dt>Vagas</dt>
                <dd>{activity.capacity}</dd>
              </div>
              <div>
                <dt>Tipo</dt>
                <dd>{activity.activityType}</dd>
              </div>
              <div>
                <dt>Área temática</dt>
                <dd>{activity.thematicArea}</dd>
              </div>
            </dl>
          </section>
          {(activity.status === "Ajustes solicitados" ||
            activity.status === "Rejeitada") &&
            decision &&
            (decision.outcome === "Ajustes solicitados" ||
              decision.outcome === "Rejeitada") && (
              <aside
                className={
                  activity.status === "Ajustes solicitados"
                    ? "curation-feedback"
                    : "curation-feedback is-rejection"
                }
              >
                <p className="eyebrow">
                  {decision.outcome === "Ajustes solicitados"
                    ? "RETORNO DA CURADORIA"
                    : "JUSTIFICATIVA DA DECISÃO"}
                </p>
                <h2>
                  {decision.outcome === "Ajustes solicitados"
                    ? "Pontos para revisar"
                    : "Proposta rejeitada"}
                </h2>
                <p>{decision.reason}</p>
                <small>Decisão em {formatDate(decision.decidedAt)}</small>
              </aside>
            )}
          <DeliveryInfo activity={activity} showLink />
          <ProposalTimeline activity={activity} users={users} />
        </article>
        <aside className="proposal-detail-aside">
          <p className="eyebrow">PRÓXIMA ETAPA</p>
          <h2>
            {activity.status === "Rascunho"
              ? "Quando estiver pronta"
              : activity.status === "Em análise"
                ? "A proposta está com a curadoria"
                : activity.status === "Ajustes solicitados"
                  ? "Revise e envie novamente"
                  : activity.status === "Aprovada"
                    ? "Sua atividade está publicada"
                    : "A jornada desta proposta foi encerrada"}
          </h2>
          <p>
            {activity.status === "Rascunho"
              ? "Envie a proposta completa para iniciar a análise."
              : activity.status === "Em análise"
                ? "Sua proposta foi enviada para análise. Ela permanecerá nesta etapa até uma decisão da curadoria."
                : activity.status === "Ajustes solicitados"
                  ? "Ajuste os pontos indicados. Salvar não apaga o comentário recebido."
                  : activity.status === "Aprovada"
                    ? "A atividade aprovada pode receber participantes no catálogo."
                    : "A justificativa da decisão fica registrada para sua consulta."}
          </p>
          {canSubmit && (
            <Button className="full-width" onClick={() => setDialogOpen(true)}>
              {activity.status === "Rascunho"
                ? "Enviar à curadoria"
                : "Submeter versão ajustada"}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          )}
          {activity.status === "Ajustes solicitados" &&
            canEditProposal(user, activity) && (
              <Button asChild variant="outline" className="full-width">
                <Link to={`/instrutor/propostas/${activity.id}/editar`}>
                  Editar proposta
                </Link>
              </Button>
            )}
          {activity.status === "Aprovada" && (
            <Button asChild className="full-width">
              <Link to={`/instrutor/atividades/${activity.id}/participantes`}>
                Ver participantes <Users size={16} aria-hidden="true" />
              </Link>
            </Button>
          )}
          {activity.status !== "Aprovada" && (
            <p className="proposal-detail-note">
              Somente atividades aprovadas aparecem no catálogo. O Instrutor não
              pode aprovar a própria proposta.
            </p>
          )}
        </aside>
      </div>
      <ConfirmationDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={submit}
        title="Enviar proposta para análise?"
        description={`“${activity.title}” ficará em análise até que o Professor Curador registre uma decisão. O envio não publica nem aprova a atividade.`}
        confirmLabel="Enviar para análise"
        cancelLabel="Revisar proposta"
        eyebrow="SUBMISSÃO À CURADORIA"
      />
    </div>
  );
}

export function NewProposalPage() {
  return <ProposalForm />;
}
export function EditProposalPage() {
  return <ProposalForm editing />;
}

function ActivityManagementCard({
  activity,
}: {
  activity: ReturnType<typeof approvedInstructorActivities>[number];
}) {
  const { state } = useDemo();
  const count = state.enrollments.filter(
    (item) => item.activityId === activity.id,
  ).length;
  return (
    <article className="instructor-activity-card">
      <div className="activity-card-kicker">
        <span>{activity.thematicArea}</span>
        <span className="approved-marker">
          <Check size={14} aria-hidden="true" />
          Aprovada
        </span>
      </div>
      <h3>{activity.title}</h3>
      <p>{activity.summary}</p>
      <div className="activity-management-facts">
        <span>
          {activity.hours} h · {activity.format}
        </span>
        <span>
          {count} {count === 1 ? "inscrição" : "inscrições"}
        </span>
        <span>
          {availableSeats(activity, state.enrollments)} vagas disponíveis de{" "}
          {activity.capacity}
        </span>
      </div>
      <Button asChild variant="outline" className="full-width">
        <Link to={`/instrutor/atividades/${activity.id}/participantes`}>
          Gerenciar participantes <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </Button>
    </article>
  );
}

export function InstructorActivitiesPage() {
  const { user, state } = useDemo();
  const activities = approvedInstructorActivities(state, user?.id ?? "");
  return (
    <div className="instructor-page">
      <header className="instructor-page-heading">
        <div>
          <p className="eyebrow">ATIVIDADES PUBLICADAS</p>
          <h1>Minhas atividades</h1>
          <p>
            Consulte inscrições e acompanhe a participação nas atividades que
            você conduz.
          </p>
        </div>
      </header>
      {activities.length ? (
        <div className="instructor-activity-grid">
          {activities.map((activity) => (
            <ActivityManagementCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhuma atividade aprovada"
          description="Propostas ainda em análise não aparecem como atividades. Quando houver uma aprovação, a atividade ficará disponível nesta lista."
        />
      )}
    </div>
  );
}

export function ActivityParticipantsPage() {
  const { activityId } = useParams();
  const { user, state, users, completeEnrollment } = useDemo();
  const [selected, setSelected] = useState<{
    enrollmentId: string;
    name: string;
    title: string;
  } | null>(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);
  const activity = state.activities.find(
    (item) =>
      item.id === activityId &&
      item.instructorId === user?.id &&
      item.status === "Aprovada",
  );
  if (!activity)
    return (
      <section className="instructor-page">
        <EmptyState
          title="Atividade não encontrada"
          description="O gerenciamento está disponível somente para suas atividades aprovadas."
        >
          <Button asChild variant="outline">
            <Link to="/instrutor/atividades">Minhas atividades</Link>
          </Button>
        </EmptyState>
      </section>
    );
  const ownedActivity = activity;
  const participants = activityParticipants(state, users, ownedActivity.id);
  const completed = participants.filter(
    (item) => item.enrollment.status === "Concluída",
  ).length;
  const seats = availableSeats(ownedActivity, state.enrollments);
  function confirmCompletion() {
    if (!selected) return;
    const result = completeEnrollment(selected.enrollmentId);
    setFeedback(result.message);
    setError(!result.ok);
    setSelected(null);
  }
  return (
    <div className="instructor-page">
      <Link className="instructor-back-link" to="/instrutor/atividades">
        <ArrowRight size={15} aria-hidden="true" />
        Minhas atividades
      </Link>
      <header className="participant-management-heading">
        <p className="eyebrow">
          {ownedActivity.thematicArea} · {ownedActivity.activityType}
        </p>
        <h1>{ownedActivity.title}</h1>
        <p>
          {ownedActivity.hours} {ownedActivity.hours === 1 ? "hora" : "horas"} ·{" "}
          {ownedActivity.format}
        </p>
      </header>
      <dl className="management-summary">
        <div>
          <dt>Capacidade</dt>
          <dd>{ownedActivity.capacity}</dd>
        </div>
        <div>
          <dt>Inscrições</dt>
          <dd>{participants.length}</dd>
        </div>
        <div>
          <dt>Concluídas</dt>
          <dd>{completed}</dd>
        </div>
        <div>
          <dt>Vagas disponíveis</dt>
          <dd>{seats}</dd>
        </div>
      </dl>
      <Button asChild variant="outline">
        <Link to={`/instrutor/atividades/${activity.id}/frequencia`}>
          {activity.format === "Remota assíncrona"
            ? "Consultar progresso dos vídeos"
            : "Registrar frequência e encontros"}
        </Link>
      </Button>
      <section className="instructor-section">
        <div className="instructor-section-heading">
          <div>
            <p className="eyebrow">PARTICIPAÇÃO NA ATIVIDADE</p>
            <h2>Participantes inscritos</h2>
          </div>
        </div>
        {feedback && (
          <FeedbackMessage error={error}>{feedback}</FeedbackMessage>
        )}
        {participants.length ? (
          <div className="managed-participant-list">
            {participants.map(({ enrollment, participant }) => (
              <article className="managed-participant" key={enrollment.id}>
                <div className="participant-avatar" aria-hidden="true">
                  {participant.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="managed-participant-info">
                  <h3>{participant.name}</h3>
                  <span>
                    Perfil demonstrativo · inscrição em{" "}
                    {formatDate(enrollment.enrolledAt)}
                  </span>
                </div>
                <span
                  className={`participant-state ${enrollment.status === "Concluída" ? "is-complete" : ""}`}
                >
                  {enrollment.status === "Concluída" ? (
                    <Check size={15} aria-hidden="true" />
                  ) : (
                    <BookOpen size={15} aria-hidden="true" />
                  )}
                  {enrollment.status}
                </span>
                <p className="field-hint">
                  {
                    completionEligibility(state, activity, participant.id)
                      .reason
                  }
                </p>
                {enrollment.status === "Inscrito" && (
                  <Button
                    variant="outline"
                    disabled={
                      !completionEligibility(state, activity, participant.id)
                        .eligible
                    }
                    onClick={() =>
                      setSelected({
                        enrollmentId: enrollment.id,
                        name: participant.name,
                        title: ownedActivity.title,
                      })
                    }
                  >
                    Confirmar conclusão
                  </Button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum participante inscrito até o momento"
            description="As inscrições confirmadas no catálogo aparecerão nesta lista."
          />
        )}
      </section>
      <ConfirmationDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        onConfirm={confirmCompletion}
        title="Confirmar conclusão?"
        description={
          selected
            ? `Confirmar a conclusão de ${selected.name} em “${selected.title}”? O histórico de horas e o comprovante demonstrativo serão atualizados.`
            : ""
        }
        confirmLabel="Confirmar conclusão"
        cancelLabel="Voltar à lista"
        eyebrow="REGISTRO DA PARTICIPAÇÃO"
      />
    </div>
  );
}
