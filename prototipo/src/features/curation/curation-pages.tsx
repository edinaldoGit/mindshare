import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCheck,
  ClipboardList,
  History,
  MessageSquareText,
  X,
} from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import type { CurationDecision } from "@/types/domain";
import {
  individualCuration,
  curationHistory,
  curationSummary,
  pendingProposals,
} from "./curation-selectors";
import { DecisionCard, PendingProposalCard } from "./curation-components";
function QueueEmpty() {
  return (
    <EmptyState
      title="Nenhuma proposta aguardando análise."
      description="As novas propostas submetidas pelos instrutores aparecerão aqui."
    />
  );
}
export function CurationDashboard() {
  const { user, state: sharedState, users } = useDemo();
  const state = individualCuration(sharedState, user);
  const summary = curationSummary(state),
    pending = pendingProposals(state, users),
    history = curationHistory(state, users);
  const metrics = [
    {
      value: summary.pending,
      label: "Aguardando análise",
      icon: ClipboardList,
      to: "/curadoria/propostas",
    },
    {
      value: summary.approved,
      label: "Propostas aprovadas",
      icon: CheckCheck,
      to: "/curadoria/historico?decisao=Aprovada",
    },
    {
      value: summary.adjustments,
      label: "Com ajustes solicitados",
      icon: MessageSquareText,
      to: "/curadoria/historico?decisao=Ajustes%20solicitados",
    },
    {
      value: summary.rejected,
      label: "Propostas rejeitadas",
      icon: X,
      to: "/curadoria/historico?decisao=Rejeitada",
    },
  ];
  return (
    <div className="instructor-page curation-page">
      <header className="instructor-page-heading curation-welcome">
        <div>
          <p className="eyebrow">UM OLHAR QUE ABRE CAMINHOS · {user?.name}</p>
          <h1>Painel de curadoria</h1>
          <p>
            Acompanhe as propostas enviadas e ajude a construir um catálogo de
            atividades colaborativas.
          </p>
        </div>
        <span className="curation-hero-icon" aria-hidden="true">
          <ClipboardList size={31} />
        </span>
      </header>
      <section
        className="instructor-metrics"
        aria-label="Situação atual das propostas"
      >
        {metrics.map(({ value, label, icon: Icon, to }) => (
          <Link
            key={label}
            className="instructor-metric curation-metric"
            to={to}
          >
            <span className="instructor-metric-icon">
              <Icon aria-hidden="true" />
            </span>
            <strong>{value}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </section>
      <section className="instructor-section">
        <div className="instructor-section-heading">
          <div>
            <p className="eyebrow">COMECE PELA PRÓXIMA LEITURA</p>
            <h2>Aguardando seu olhar</h2>
          </div>
          <Link to="/curadoria/propostas">
            Ver fila completa <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <p className="curation-section-note">
          Da submissão mais antiga à mais recente. Uma proposta de cada vez.
        </p>
        <div className="proposal-list">
          {pending.length ? (
            pending
              .slice(0, 3)
              .map((entry, index) => (
                <PendingProposalCard
                  key={entry.activity.id}
                  entry={entry}
                  first={index === 0}
                />
              ))
          ) : (
            <QueueEmpty />
          )}
        </div>
      </section>
      <section className="instructor-section">
        <div className="curation-history-invite">
          <History size={27} aria-hidden="true" />
          <div>
            <h2>Decisões que constroem o catálogo</h2>
            <p>
              Consulte os registros de aprovação, rejeição e solicitação de
              ajustes. O histórico conserva os ciclos anteriores.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/curadoria/historico">
              Consultar histórico <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </Button>
        </div>
        {history[0] && (
          <p className="curation-section-note">
            Última decisão registrada: {history[0].activity.title} ·{" "}
            {history[0].decision.outcome}.
          </p>
        )}
      </section>
    </div>
  );
}
export function CurationQueuePage() {
  const { user, state: sharedState, users } = useDemo();
  const state = individualCuration(sharedState, user);
  const pending = pendingProposals(state, users);
  return (
    <div className="instructor-page curation-page">
      <header className="instructor-page-heading">
        <div>
          <p className="eyebrow">DA PROPOSTA À POSSIBILIDADE</p>
          <h1>Fila de propostas</h1>
          <p>
            Conheça as ideias enviadas pelos instrutores. Somente propostas em
            análise aparecem nesta fila.
          </p>
        </div>
      </header>
      <div className="curation-queue-bar">
        <span>
          <ClipboardList size={17} aria-hidden="true" />
          <strong>{pending.length}</strong>{" "}
          {pending.length === 1
            ? "proposta aguardando análise"
            : "propostas aguardando análise"}
        </span>
        <span>Mais antigas primeiro</span>
      </div>
      <div className="proposal-list">
        {pending.length ? (
          pending.map((entry, index) => (
            <PendingProposalCard
              key={entry.activity.id}
              entry={entry}
              first={index === 0}
            />
          ))
        ) : (
          <QueueEmpty />
        )}
      </div>
    </div>
  );
}
export function CurationHistoryPage() {
  const { user, state: sharedState, users } = useDemo();
  const state = individualCuration(sharedState, user);
  const [filter, setFilter] = useState<CurationDecision["outcome"] | "">(() => {
    const initial = new URLSearchParams(window.location.hash.split("?")[1]).get(
      "decisao",
    );
    return initial === "Aprovada" ||
      initial === "Rejeitada" ||
      initial === "Ajustes solicitados"
      ? initial
      : "";
  });
  const entries = curationHistory(state, users, filter || undefined);
  return (
    <div className="instructor-page curation-page">
      <header className="instructor-page-heading">
        <div>
          <p className="eyebrow">MEMÓRIA DA CURADORIA</p>
          <h1>Histórico de decisões</h1>
          <p>
            Cada decisão faz parte da trajetória de uma proposta. Os registros
            anteriores continuam aqui após uma nova submissão.
          </p>
        </div>
      </header>
      <div className="proposal-filter">
        <label htmlFor="curation-history-filter">Tipo de decisão</label>
        <select
          id="curation-history-filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value as typeof filter)}
        >
          <option value="">Todas as decisões</option>
          <option value="Aprovada">Aprovações</option>
          <option value="Ajustes solicitados">Ajustes solicitados</option>
          <option value="Rejeitada">Rejeições</option>
        </select>
        <span role="status">
          {entries.length} {entries.length === 1 ? "registro" : "registros"}
        </span>
      </div>
      <p className="curation-section-note">
        O filtro considera a decisão registrada, mesmo quando a situação atual
        da proposta já mudou.
      </p>
      <div className="proposal-list">
        {entries.length ? (
          entries.map((entry) => (
            <DecisionCard key={entry.decision.id} entry={entry} />
          ))
        ) : (
          <EmptyState
            title="Nenhuma decisão neste filtro"
            description="As decisões registradas pela curadoria aparecerão aqui. Experimente consultar todos os tipos."
          />
        )}
      </div>
    </div>
  );
}
