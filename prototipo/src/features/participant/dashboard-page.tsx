import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  Clock3,
  FileText,
  Compass,
} from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/section-heading";
import { EmptyState } from "@/components/feedback/empty-state";
import { ActivityCard } from "@/features/catalog/components/activity-card";
import {
  availableSeats,
  publishedActivities,
} from "@/features/catalog/catalog-selectors";
import {
  participantSummary,
  participantActivities,
} from "./participant-selectors";
import { ParticipantHeader } from "./components/participant-header";
import { EnrollmentList } from "./components/enrollment-list";
export function DashboardPage() {
  const { state, users, user } = useDemo();
  if (!user) return null;
  const summary = participantSummary(state, users, user.id);
  const items = participantActivities(state, users, user.id);
  const enrolled = new Set(items.map((item) => item.activity.id));
  const suggestions = publishedActivities(state.activities)
    .filter(
      (activity) =>
        !enrolled.has(activity.id) &&
        availableSeats(activity, state.enrollments) > 0,
    )
    .slice(0, 3);
  const metrics = [
    {
      label: "Inscrições",
      value: summary.enrollments,
      icon: BookOpen,
      path: "/participante/inscricoes",
    },
    {
      label: "Atividades concluídas",
      value: summary.completed,
      icon: Check,
      path: "/participante/inscricoes?status=Conclu%C3%ADda",
    },
    {
      label: "Horas acumuladas",
      value: summary.hours,
      icon: Clock3,
      path: "/participante/historico",
    },
    {
      label: "Comprovantes disponíveis",
      value: summary.certificates,
      icon: FileText,
      path: "/participante/comprovantes",
    },
  ];
  return (
    <div className="participant-page dashboard-page">
      <ParticipantHeader
        eyebrow="CADA TROCA CONTA"
        title={`Olá, ${user.name.split(" ")[0]}.`}
        description="Seu conhecimento cresce a cada encontro."
      >
        <Button asChild variant="outline">
          <Link to="/catalogo">
            Explorar atividades
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </Button>
      </ParticipantHeader>
      <section
        className="participant-metrics"
        aria-label="Resumo do meu aprendizado"
      >
        {metrics.map(({ label, value, icon: Icon, path }) => (
          <Link to={path} key={label} className="summary-card">
            <span className="summary-card-top">
              <Icon size={18} aria-hidden="true" />
              <ArrowUpRight size={14} aria-hidden="true" />
            </span>
            <strong>{value}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </section>
      <div className="learning-invitation">
        <div>
          <p className="eyebrow">SEU PRÓXIMO PASSO</p>
          <h2>
            Deixe a curiosidade
            <br />
            escolher o caminho.
          </h2>
          <p>Combine seus interesses com o tempo que você tem para aprender.</p>
          <Link to="/participante/recomendacoes" className="text-link">
            Encontrar por interesse
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <span className="learning-invitation-icon" aria-hidden="true">
          <Compass size={72} strokeWidth={1} />
        </span>
      </div>
      <section className="participant-section">
        <SectionHeading
          eyebrow="O QUE FAZ PARTE DA SUA JORNADA"
          title="Minhas atividades"
        >
          <Link to="/participante/inscricoes" className="text-link">
            Ver todas
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </SectionHeading>
        {items.length ? (
          <EnrollmentList items={items.slice(0, 3)} />
        ) : (
          <EmptyState
            title="Sua primeira troca está logo ali."
            description="Você ainda não tem inscrições. Explore o catálogo e encontre uma atividade para começar."
          >
            <Button asChild>
              <Link to="/catalogo">Explorar catálogo</Link>
            </Button>
          </EmptyState>
        )}
      </section>
      <section className="participant-section">
        <SectionHeading
          eyebrow="CONTINUE EXPLORANDO"
          title="Uma nova ideia pode estar aqui."
        >
          <Link to="/catalogo" className="text-link">
            Ver catálogo
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </SectionHeading>
        <p className="participant-section-description">
          Atividades aprovadas com vagas em que você ainda não está inscrito.
        </p>
        {suggestions.length ? (
          <div className="activity-grid participant-suggestions">
            {suggestions.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Você explorou as opções com vagas."
            description="Consulte o catálogo para conhecer todas as atividades publicadas."
          />
        )}
      </section>
    </div>
  );
}
