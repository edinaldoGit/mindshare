import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ClipboardList, ShieldCheck, Users } from "lucide-react";
import { WorkspaceFrame } from "@/components/layout/workspace-frame";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
import { ConfirmationDialog } from "@/components/feedback/confirmation-dialog";
import { useDemo } from "@/app/providers/demo-context";
import {
  activeCurators,
  decideFaculty,
  reassignProposal,
  toggleCurator,
} from "@/lib/demo/evolution";
export function AdminLayout() {
  return (
    <WorkspaceFrame
      identity="Administração"
      navigationLabel="Administração"
      mobileLabel="Área administrativa"
      links={[
        { path: "/administracao", label: "Visão geral", icon: ShieldCheck },
        {
          path: "/administracao/docentes",
          label: "Solicitações docentes",
          icon: ClipboardList,
        },
        {
          path: "/administracao/curadores",
          label: "Curadores e atribuições",
          icon: Users,
        },
      ]}
      aside={
        <p>
          Gestão de acesso docente. O mérito acadêmico pertence ao Curador
          designado.
        </p>
      }
      footnote="MindShare · Gestão acadêmica"
    />
  );
}
export function AdminDashboard() {
  const { state } = useDemo();
  const metrics = [
    [
      "Solicitações pendentes",
      state.applications.filter((a) => a.status === "Pendente").length,
    ],
    [
      "Professores aprovados",
      state.users.filter(
        (u) => u.kind === "Professor Curador" && u.verified !== false,
      ).length,
    ],
    ["Professores ativos", activeCurators(state).length],
    [
      "Solicitações rejeitadas",
      state.applications.filter((a) => a.status === "Rejeitada").length,
    ],
  ];
  return (
    <div className="instructor-page">
      <p className="eyebrow">ACESSOS QUE VIABILIZAM TROCAS</p>
      <h1>Painel administrativo</h1>
      <p>
        Valide solicitações docentes e mantenha as atribuições acadêmicas
        organizadas.
      </p>
      <div className="instructor-metrics">
        {metrics.map(([label, value]) => (
          <Link
            className="instructor-metric"
            to="/administracao/docentes"
            key={label}
          >
            <strong>{value}</strong>
            <span>{label}</span>
          </Link>
        ))}
      </div>
      <div className="learning-card">
        <h2>Uma responsabilidade bem definida</h2>
        <p>
          A Administração valida o cadastro, ativa permissões e transfere
          atribuições. Aprovar, rejeitar ou solicitar ajustes em uma proposta é
          responsabilidade exclusiva do Professor Curador designado.
        </p>
        <Button asChild>
          <Link to="/administracao/docentes">Analisar solicitações</Link>
        </Button>
      </div>
    </div>
  );
}
export function FacultyList() {
  const { state } = useDemo();
  return (
    <div className="instructor-page">
      <p className="eyebrow">VÍNCULO E IDENTIDADE</p>
      <h1>Solicitações docentes</h1>
      <div className="proposal-list">
        {state.applications.map((a) => (
          <article className="proposal-card" key={a.id}>
            <p className="eyebrow">
              {a.method} · {a.status}
            </p>
            <h2>{a.name}</h2>
            <p>{a.department}</p>
            <p>
              Recebida em {new Date(a.createdAt).toLocaleDateString("pt-BR")}
            </p>
            <Link to={`/administracao/docentes/${a.id}`}>
              Consultar solicitação →
            </Link>
          </article>
        ))}
        {!state.applications.length && <p>Nenhuma solicitação recebida.</p>}
      </div>
    </div>
  );
}
export function FacultyDetail() {
  const { id } = useParams();
  const { state, run } = useDemo();
  const [reason, setReason] = useState(""),
    [notice, setNotice] = useState(""),
    [decision, setDecision] = useState<boolean | null>(null);
  const a = state.applications.find((a) => a.id === id);
  if (!a)
    return (
      <section className="instructor-page">
        <h1>Solicitação indisponível</h1>
        <Link to="/administracao/docentes">Voltar à lista</Link>
      </section>
    );
  return (
    <div className="instructor-page">
      <Link to="/administracao/docentes">← Solicitações</Link>
      <p className="eyebrow">{a.status}</p>
      <h1>{a.name}</h1>
      <section className="learning-card">
        <h2>Dados da solicitação</h2>
        <p>{a.email}</p>
        <p>
          {a.department} · {a.method}
        </p>
        <h3>Comprovação representada</h3>
        <p>{a.evidence}</p>
        <p className="field-hint">
          Este é um exemplo fictício. Não há armazenamento de documento pessoal
          nem consulta institucional real.
        </p>
        {a.reason && <p>Motivo registrado: {a.reason}</p>}
        {a.decidedAt && (
          <p>Decisão em {new Date(a.decidedAt).toLocaleString("pt-BR")}</p>
        )}
      </section>
      {notice && <FeedbackMessage>{notice}</FeedbackMessage>}
      {a.status === "Pendente" && (
        <section className="learning-card">
          <h2>Decisão administrativa</h2>
          <label className="instructor-field">
            Justificativa
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <div className="learning-actions">
            <Button onClick={() => setDecision(true)}>Aprovar cadastro</Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!reason.trim())
                  setNotice("Informe uma justificativa para rejeitar.");
                else setDecision(false);
              }}
            >
              Rejeitar cadastro
            </Button>
          </div>
        </section>
      )}
      <ConfirmationDialog
        open={decision !== null}
        onClose={() => setDecision(null)}
        onConfirm={() => {
          const r = run((s, u) =>
            decideFaculty(
              s,
              u,
              a.id,
              decision === true,
              reason,
              new Date().toISOString(),
            ),
          );
          setNotice(r.message);
          setDecision(null);
        }}
        title={
          decision
            ? "Aprovar acesso à curadoria?"
            : "Rejeitar esta solicitação?"
        }
        description={
          decision
            ? "O docente receberá permissão ativa de Professor Curador. A ação não aprova nenhuma atividade."
            : "O motivo ficará associado à solicitação, que não habilitará acesso à curadoria."
        }
        confirmLabel="Confirmar decisão"
        cancelLabel="Voltar"
        eyebrow="VALIDAÇÃO DOCENTE"
      />
    </div>
  );
}
export function CuratorManagement() {
  const { state, run } = useDemo();
  const [target, setTarget] = useState<string | null>(null),
    [proposal, setProposal] = useState(""),
    [curator, setCurator] = useState(""),
    [reason, setReason] = useState(""),
    [notice, setNotice] = useState("");
  return (
    <div className="instructor-page">
      <p className="eyebrow">DISTRIBUIÇÃO RESPONSÁVEL</p>
      <h1>Curadores e atribuições</h1>
      {notice && <FeedbackMessage>{notice}</FeedbackMessage>}
      <div className="proposal-list">
        {state.users
          .filter((u) => u.kind === "Professor Curador")
          .map((u) => (
            <article key={u.id} className="proposal-card">
              <h2>{u.name}</h2>
              <p>
                {u.kind === "Professor Curador" && u.active !== false
                  ? "Ativo"
                  : "Inativo"}{" "}
                · cadastro validado
              </p>
              <p>
                {
                  state.activities.filter(
                    (a) => a.curatorId === u.id && a.status === "Em análise",
                  ).length
                }{" "}
                proposta(s) em análise
              </p>
              <Button variant="outline" onClick={() => setTarget(u.id)}>
                {u.kind === "Professor Curador" && u.active !== false
                  ? "Desativar"
                  : "Ativar"}{" "}
                {u.name}
              </Button>
            </article>
          ))}
      </div>
      <section className="learning-card">
        <h2>Reatribuir proposta pendente</h2>
        <p>
          Quando o responsável estiver indisponível, transfira a outro professor
          ativo. O estado acadêmico permanece o mesmo.
        </p>
        <label className="instructor-field">
          Proposta
          <select
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
          >
            <option value="">Selecione uma proposta</option>
            {state.activities
              .filter((a) =>
                ["Em análise", "Ajustes solicitados"].includes(a.status),
              )
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ·{" "}
                  {state.users.find((u) => u.id === a.curatorId)?.name}
                </option>
              ))}
          </select>
        </label>
        <label className="instructor-field">
          Novo responsável
          <select value={curator} onChange={(e) => setCurator(e.target.value)}>
            <option value="">Selecione um professor</option>
            {activeCurators(state).map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
        <label className="instructor-field">
          Motivo da transferência
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
        <Button
          onClick={() =>
            setNotice(
              run((s, u) =>
                reassignProposal(
                  s,
                  u,
                  proposal,
                  curator,
                  reason,
                  new Date().toISOString(),
                ),
              ).message,
            )
          }
        >
          Transferir proposta
        </Button>
      </section>
      <ConfirmationDialog
        open={target !== null}
        onClose={() => setTarget(null)}
        onConfirm={() => {
          if (target)
            setNotice(run((s, u) => toggleCurator(s, u, target)).message);
          setTarget(null);
        }}
        title="Alterar permissão do Curador?"
        description="Desativar bloqueia novas submissões e decisões desse professor. Propostas pendentes podem ser reatribuídas com registro."
        confirmLabel="Confirmar alteração"
        cancelLabel="Voltar"
        eyebrow="PERMISSÕES"
      />
    </div>
  );
}
