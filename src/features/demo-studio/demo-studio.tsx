import { isStudioUrlEnabled } from "./studio-rules";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MonitorPlay, Minimize2, X } from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { ConfirmationDialog } from "@/components/feedback/confirmation-dialog";
import { completionEligibility } from "@/lib/demo/evolution";
const studioEnabled = () => isStudioUrlEnabled(window.location.href);
export function DemoStudio() {
  const { state, user, signOut, resetDemo } = useDemo(),
    navigate = useNavigate(),
    location = useLocation();
  const [open, setOpen] = useState(true),
    [closed, setClosed] = useState(false),
    [reset, setReset] = useState(false),
    [account, setAccount] = useState("discente-participante-demo"),
    [scenario, setScenario] = useState("docente"),
    [fast, setFast] = useState(
      () => sessionStorage.getItem("mindshare:studio:fast") === "1",
    );
  if (!studioEnabled() || closed) return null;
  const role =
    user?.kind === "Discente"
      ? location.pathname.startsWith("/instrutor")
        ? "Instrutor"
        : "Participante"
      : user?.kind;
  const links: Record<string, [string, string][]> = {
    Participante: [
      ["Explorar e inscrever", "/catalogo"],
      ["Minhas inscrições", "/participante/inscricoes"],
      [
        "Frequência presencial",
        "/participante/atividades/oficina-presencial/frequencia",
      ],
      ["Videoaula real", "/participante/atividades/animacao-digital/aulas"],
      ["Histórico", "/participante/historico"],
      ["Comprovantes", "/participante/comprovantes"],
    ],
    Instrutor: [
      ["Criar e escolher Curador", "/instrutor/propostas/nova"],
      ["Propostas e ajustes", "/instrutor/propostas"],
      ["Gerenciar atividades", "/instrutor/atividades"],
      [
        "Registrar frequência",
        "/instrutor/atividades/oficina-presencial/frequencia",
      ],
      [
        "Progresso e conclusão",
        "/instrutor/atividades/animacao-digital/participantes",
      ],
    ],
    "Professor Curador": [
      ["Fila atribuída", "/curadoria/propostas"],
      ["Painel de curadoria", "/curadoria"],
      ["Histórico de decisões", "/curadoria/historico"],
    ],
    Administrador: [
      ["Solicitações e decisões", "/administracao/docentes"],
      ["Curadores e reatribuições", "/administracao/curadores"],
    ],
  };
  const video = state.activities.find((a) => a.id === "animacao-digital");
  const enrollment = state.enrollments.find(
    (e) =>
      e.activityId === video?.id &&
      e.participantId === "discente-participante-demo",
  );
  const scenarios: Record<
    string,
    {
      name: string;
      description: string;
      steps: [string, boolean][];
      start: string;
      user: string;
    }
  > = {
    docente: {
      name: "A · Cadastro e aprovação docente",
      description:
        "Professor solicita → Administração decide → Curador é habilitado.",
      steps: [
        ["Solicitação recebida", state.applications.length > 1],
        [
          "Decisão administrativa",
          state.applications.some((a) => a.status !== "Pendente"),
        ],
      ],
      start: "/cadastro/professor",
      user: "admin-demo",
    },
    curadoria: {
      name: "B · Proposta e curadoria direcionada",
      description:
        "Alex escolhe professor, envia, recebe ajustes e reenvia. O professor designado aprova.",
      steps: [
        [
          "Proposta de Alex submetida",
          state.activities.some(
            (a) => a.instructorId === "discente-demo" && !!a.submittedAt,
          ),
        ],
        [
          "Ajustes registrados",
          state.activities.some(
            (a) =>
              a.instructorId === "discente-demo" &&
              a.decisions.some((d) => d.outcome === "Ajustes solicitados"),
          ),
        ],
        [
          "Publicação aprovada",
          state.activities.some(
            (a) =>
              a.instructorId === "discente-demo" &&
              a.status === "Aprovada" &&
              !!a.delivery,
          ),
        ],
      ],
      start: "/instrutor/propostas/nova",
      user: "discente-demo",
    },
    frequencia: {
      name: "C · Oficina e frequência",
      description:
        "Júlia inscreve-se, Alex registra encontros/presenças e confirma se elegível.",
      steps: [
        [
          "Inscrição na oficina",
          state.enrollments.some((e) => e.activityId === "oficina-presencial"),
        ],
        [
          "Frequência lançada",
          state.attendance.some((r) => r.activityId === "oficina-presencial"),
        ],
        [
          "Conclusão confirmada",
          state.enrollments.some(
            (e) =>
              e.activityId === "oficina-presencial" && e.status === "Concluída",
          ),
        ],
      ],
      start: "/atividades/oficina-presencial",
      user: "discente-participante-demo",
    },
    video: {
      name: "D · Curso assíncrono",
      description:
        "Inscrição → vídeo real → confirmação/pausa/retomada → progresso → conclusão e PDF.",
      steps: [
        ["Inscrição de Júlia", !!enrollment],
        [
          "Progresso registrado",
          state.progress.some(
            (p) => p.activityId === video?.id && p.intervals.length > 0,
          ),
        ],
        [
          "Critérios de Júlia atendidos",
          !!video &&
            completionEligibility(state, video, "discente-participante-demo")
              .eligible,
        ],
        ["Conclusão e PDF", enrollment?.status === "Concluída"],
      ],
      start: "/atividades/animacao-digital",
      user: "discente-participante-demo",
    },
    completo: {
      name: "E · Ciclo completo",
      description:
        "Instrutor → Curador → Participante → Instrutor → Participante. As ações acontecem nas telas do produto.",
      steps: [
        [
          "Proposta com responsável",
          state.activities.some(
            (a) => a.instructorId === "discente-demo" && !!a.curatorId,
          ),
        ],
        ["Inscrição", !!enrollment],
        ["Conclusão registrada", enrollment?.status === "Concluída"],
      ],
      start: "/instrutor/propostas/nova",
      user: "discente-demo",
    },
  };
  const current = scenarios[scenario];
  function prepareLogin(id: string, destination?: string) {
    const account = state.users.find((u) => u.id === id);
    if (!account) return;
    signOut();
    const home =
      destination ??
      (account.kind === "Administrador"
        ? "/administracao"
        : account.kind === "Professor Curador"
          ? "/curadoria"
          : id === "discente-demo"
            ? "/instrutor"
            : "/participante");
    navigate(
      `/entrar?conta=${encodeURIComponent(account.email)}&retorno=${encodeURIComponent(home)}`,
    );
  }
  return (
    <>
      <aside
        className={open ? "demo-studio" : "demo-studio minimized"}
        aria-label="MindShare Demo Studio"
      >
        {!open ? (
          <button className="studio-launch" onClick={() => setOpen(true)}>
            <MonitorPlay size={18} /> Demo Studio
          </button>
        ) : (
          <>
            <header>
              <div>
                <small>FERRAMENTA DE APRESENTAÇÃO</small>
                <h2>MindShare Demo Studio</h2>
              </div>
              <button
                aria-label="Minimizar Demo Studio"
                onClick={() => setOpen(false)}
              >
                <Minimize2 size={17} />
              </button>
              <button
                aria-label="Fechar Demo Studio"
                onClick={() => setClosed(true)}
              >
                <X size={17} />
              </button>
            </header>
            <div className="studio-body">
              <p className="studio-session">
                {user
                  ? `${user.name} · ${role}`
                  : "Sem sessão · escolha uma conta fictícia"}
              </p>
              <label>
                Conta para apresentação
                <select
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                >
                  {state.users
                    .filter(
                      (u) =>
                        u.id.startsWith("discente") || u.kind !== "Discente",
                    )
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} · {u.kind}
                      </option>
                    ))}
                </select>
              </label>
              <button onClick={() => prepareLogin(account)}>
                Preencher o login normal
              </button>
              {user?.kind === "Discente" && (
                <div className="studio-links">
                  <button onClick={() => navigate("/participante")}>
                    Contexto Participante
                  </button>
                  <button onClick={() => navigate("/instrutor")}>
                    Contexto Instrutor
                  </button>
                </div>
              )}
              {role && (
                <section>
                  <h3>Atalhos do perfil atual</h3>
                  <div className="studio-links">
                    {links[role]?.map(([label, to]) => (
                      <button key={to} onClick={() => navigate(to)}>
                        {label} →
                      </button>
                    ))}
                  </div>
                </section>
              )}
              <section>
                <h3>Cenários guiados</h3>
                <label>
                  Jornada
                  <select
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                  >
                    {Object.entries(scenarios).map(([id, s]) => (
                      <option key={id} value={id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
                <p>{current.description}</p>
                <ol>
                  {current.steps.map(([label, done]) => (
                    <li key={label}>
                      {done ? "✓" : "○"} {label}
                    </li>
                  ))}
                </ol>
                <p>
                  As marcações refletem os dados atuais, incluindo exemplos
                  iniciais. Navegar não executa decisões.
                </p>
                <button
                  onClick={() => {
                    if (scenario === "docente") navigate(current.start);
                    else prepareLogin(current.user, current.start);
                  }}
                >
                  Iniciar cenário pelo fluxo real
                </button>
              </section>
              <label className="studio-checkbox">
                <input
                  type="checkbox"
                  checked={fast}
                  onChange={(e) => {
                    setFast(e.target.checked);
                    sessionStorage.setItem(
                      "mindshare:studio:fast",
                      e.target.checked ? "1" : "0",
                    );
                    window.dispatchEvent(
                      new Event("mindshare:studio-settings"),
                    );
                  }}
                />{" "}
                Verificações de vídeo a cada 15 s
              </label>
              <p>
                Somente para apresentação. Não altera o progresso mínimo
                publicado. Credencial pública: demonstracao. Dados e sessão são
                locais, sem validação institucional real.
              </p>
              <button onClick={() => setReset(true)}>
                Preparar/restaurar cenário inicial
              </button>
            </div>
          </>
        )}
      </aside>
      <ConfirmationDialog
        open={reset}
        onClose={() => setReset(false)}
        onConfirm={() => {
          resetDemo();
          setReset(false);
          navigate("/");
        }}
        title="Restaurar os cenários iniciais?"
        description="Propostas, solicitações, decisões, inscrições, frequências e progresso serão substituídos pelos exemplos iniciais. Não há duplicação. A sessão de uma conta criada durante a apresentação pode ser encerrada."
        confirmLabel="Restaurar dados"
        cancelLabel="Preservar alterações"
        eyebrow="DEMO STUDIO"
      />
    </>
  );
}
