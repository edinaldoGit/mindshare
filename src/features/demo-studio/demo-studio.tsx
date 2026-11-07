import { isStudioUrlEnabled, studioLoginPath } from "./studio-rules";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MonitorPlay, Minimize2 } from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { ConfirmationDialog } from "@/components/feedback/confirmation-dialog";

export function DemoStudio() {
  const { state, user, signOut, resetDemo } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [reset, setReset] = useState(false);
  if (!isStudioUrlEnabled(window.location.href)) return null;
  const role =
    user?.kind === "Discente"
      ? location.pathname.startsWith("/instrutor")
        ? "Instrutor"
        : "Participante"
      : user?.kind;
  function selectAccount(id: string) {
    const account = state.users.find((u) => u.id === id);
    if (!account) return;
    signOut();
    navigate(studioLoginPath(account));
    setOpen(false);
  }
  return (
    <>
      <aside
        className={open ? "demo-studio" : "demo-studio minimized"}
        aria-label="MindShare Demo Studio"
      >
        {!open ? (
          <button
            className="studio-launch"
            aria-label="Expandir Demo Studio"
            onClick={() => setOpen(true)}
          >
            <MonitorPlay size={18} aria-hidden="true" /> Demo Studio
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
                title="Minimizar Demo Studio"
                onClick={() => setOpen(false)}
              >
                <Minimize2 size={18} aria-hidden="true" />
              </button>
            </header>
            <div className="studio-body">
              <p className="studio-session">
                Usuário atual:{" "}
                {user ? `${user.name} · ${role}` : "nenhuma conta conectada"}
              </p>
              <label>
                Trocar usuário
                <select
                  value=""
                  onChange={(e) => selectAccount(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione uma conta demonstrativa
                  </option>
                  {state.users
                    .filter(
                      (u) =>
                        u.id.startsWith("discente") || u.kind !== "Discente",
                    )
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ·{" "}
                        {u.id === "discente-demo"
                          ? "Instrutor / Participante"
                          : u.kind}
                      </option>
                    ))}
                </select>
              </label>
              <p>A seleção preenche o login. Clique em Entrar para acessar.</p>
              <section>
                <h3>Restaurar dados</h3>
                <button onClick={() => setReset(true)}>
                  Restaurar dados iniciais
                </button>
              </section>
            </div>
          </>
        )}
      </aside>
      <ConfirmationDialog
        open={reset}
        onClose={() => setReset(false)}
        onConfirm={() => {
          resetDemo();
          sessionStorage.removeItem("mindshare:studio:fast");
          window.dispatchEvent(new Event("mindshare:studio-settings"));
          setReset(false);
        }}
        title="Restaurar os dados demonstrativos?"
        description="Inscrições, propostas, solicitações, frequências e progresso serão restaurados aos exemplos iniciais, sem duplicações. A sessão será mantida se a conta existir nos exemplos."
        confirmLabel="Restaurar dados"
        cancelLabel="Preservar alterações"
        eyebrow="DEMO STUDIO"
      />
    </>
  );
}
