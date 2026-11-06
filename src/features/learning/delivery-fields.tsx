import { useId } from "react";
import type { Activity, Delivery } from "@/types/domain";
import { useDemo } from "@/app/providers/demo-context";
import {
  activeCurators,
  demoLesson,
  emptyDelivery,
} from "@/lib/demo/evolution";
import type { ProposalInput } from "@/lib/demo/state";
import { Button } from "@/components/ui/button";
function localDateTime(date: string) {
  const d = new Date(date);
  if (!Number.isFinite(d.getTime())) return "";
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
export function DeliveryFields({
  values,
  onChange,
  locked = false,
  errors = {},
}: {
  values: ProposalInput;
  onChange: (patch: Partial<ProposalInput>) => void;
  locked?: boolean;
  errors?: { curatorId?: string; delivery?: string };
}) {
  const { state } = useDemo();
  const errorId = useId();
  const chosen = state.users.find((u) => u.id === values.curatorId);
  const d = values.delivery ?? emptyDelivery();
  function patch(next: Partial<Delivery>) {
    onChange({ delivery: { ...d, ...next } });
  }
  return (
    <section
      className="proposal-form-section"
      tabIndex={-1}
      aria-invalid={!!errors.delivery}
      aria-describedby={errors.delivery ? `${errorId}-delivery` : undefined}
    >
      <p className="eyebrow">03 · REALIZAÇÃO E CURADORIA</p>
      <h2>Planeje a participação</h2>
      {errors.delivery && (
        <p role="alert" className="field-error" id={`${errorId}-delivery`}>
          {errors.delivery}
        </p>
      )}
      <label className="instructor-field">
        Professor Curador responsável
        <select
          value={values.curatorId ?? ""}
          disabled={locked}
          aria-invalid={!!errors.curatorId}
          aria-describedby={errors.curatorId ? `${errorId}-curator` : undefined}
          onChange={(e) => onChange({ curatorId: e.target.value })}
        >
          <option value="">Selecione um professor</option>
          {locked &&
            chosen &&
            !activeCurators(state).some((u) => u.id === chosen.id) && (
              <option value={chosen.id}>
                {chosen.name} · inativo · solicite reatribuição
              </option>
            )}
          {activeCurators(state).map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} · UFC Quixadá
            </option>
          ))}
        </select>
      </label>
      {errors.curatorId && (
        <p role="alert" className="field-error" id={`${errorId}-curator`}>
          {errors.curatorId}
        </p>
      )}
      {locked && (
        <p className="field-hint">
          Após a submissão, a atribuição só pode ser alterada pela
          Administração.
        </p>
      )}
      <label className="instructor-field">
        {values.format === "Remota assíncrona"
          ? "Progresso mínimo exigido (%)"
          : "Frequência mínima exigida (%)"}
        <input
          type="number"
          min="0"
          max="100"
          value={d.minimum}
          onChange={(e) => patch({ minimum: Number(e.target.value) })}
        />
      </label>
      {values.format === "Remota assíncrona" ? (
        <div className="learning-card">
          <h3>Videoaulas disponíveis</h3>
          <label>
            <input
              type="checkbox"
              checked={d.lessons.some((l) => l.id === demoLesson.id)}
              onChange={(e) =>
                patch({ lessons: e.target.checked ? [demoLesson] : [] })
              }
            />{" "}
            {demoLesson.title} · 3 minutos · obrigatória
          </label>
          <p>
            Trecho de Big Buck Bunny · Blender Foundation · CC BY 3.0. A mídia
            já está disponível na biblioteca local do projeto.
          </p>
        </div>
      ) : (
        <>
          {values.format === "Presencial" ? (
            <label className="instructor-field">
              Local de realização
              <input
                value={d.location}
                onChange={(e) => patch({ location: e.target.value })}
              />
            </label>
          ) : (
            <label className="instructor-field">
              Link da reunião
              <input
                type="url"
                placeholder="https://meet.google.com/..."
                value={d.link}
                onChange={(e) => patch({ link: e.target.value })}
              />
              <span className="field-hint">
                Disponível aos inscritos. Nenhuma integração com a plataforma
                externa.
              </span>
            </label>
          )}
          <h3>Encontros planejados</h3>
          {d.meetings.map((m, i) => (
            <div className="meeting-editor" key={m.id}>
              <label className="instructor-field">
                Encontro {i + 1} · data e horário
                <input
                  type="datetime-local"
                  value={localDateTime(m.date)}
                  onChange={(e) => {
                    const date = e.target.value;
                    patch({
                      meetings: d.meetings.map((x) =>
                        x.id === m.id
                          ? {
                              ...x,
                              date: date ? new Date(date).toISOString() : "",
                            }
                          : x,
                      ),
                    });
                  }}
                />
              </label>
              <label className="instructor-field">
                Duração (min)
                <input
                  type="number"
                  min="1"
                  value={m.duration}
                  onChange={(e) =>
                    patch({
                      meetings: d.meetings.map((x) =>
                        x.id === m.id
                          ? { ...x, duration: Number(e.target.value) }
                          : x,
                      ),
                    })
                  }
                />
              </label>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  patch({ meetings: d.meetings.filter((x) => x.id !== m.id) })
                }
              >
                Remover encontro {i + 1}
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              patch({
                meetings: [
                  ...d.meetings,
                  {
                    id: crypto.randomUUID(),
                    date: new Date(Date.now() + 86400000).toISOString(),
                    duration: 60,
                    status: "Planejado",
                  },
                ],
              })
            }
          >
            Adicionar encontro
          </Button>
        </>
      )}
      <label className="instructor-field">
        Orientações e critérios de conclusão
        <textarea
          rows={3}
          value={d.instructions}
          onChange={(e) => patch({ instructions: e.target.value })}
        />
      </label>
      <p className="field-hint">
        O percentual é definido pelo Instrutor e será analisado pelo Curador.
        Não representa um mínimo institucional da UFC.
      </p>
    </section>
  );
}
export function DeliveryInfo({
  activity,
  showLink = false,
}: {
  activity: Activity;
  showLink?: boolean;
}) {
  const { users } = useDemo();
  const d = activity.delivery;
  return (
    <section className="learning-card">
      <p className="eyebrow">COMO PARTICIPAR</p>
      <h2>Organização e conclusão</h2>
      <p>
        Professor responsável pela análise:{" "}
        <strong>
          {users.find((u) => u.id === activity.curatorId)?.name ?? "A definir"}
        </strong>
      </p>
      {d ? (
        <>
          <p>
            <strong>{activity.format}</strong> · mínimo de {d.minimum}% de{" "}
            {activity.format === "Remota assíncrona"
              ? "progresso validado nos vídeos obrigatórios, com confirmação de acompanhamento"
              : "frequência, com todos os encontros realizados contabilizados e atividade encerrada"}
            .
          </p>
          {activity.format === "Presencial" && d.location && (
            <p>Local: {d.location}</p>
          )}
          {activity.format === "Remota síncrona" &&
            d.link &&
            (showLink ? (
              <a href={d.link} target="_blank" rel="noopener noreferrer">
                Acessar encontro remoto ↗
              </a>
            ) : (
              <p>Link do encontro disponível após a inscrição.</p>
            ))}
          <p>{d.instructions}</p>
          {d.meetings.map((m, i) => (
            <p key={m.id}>
              Encontro {i + 1} · {new Date(m.date).toLocaleString("pt-BR")} ·{" "}
              {m.duration} min · {m.status}
            </p>
          ))}
          {d.lessons.map((l) => (
            <p key={l.id}>
              ▶ {l.title} · {Math.round(l.duration / 60)} min ·{" "}
              {l.required ? "obrigatório" : "opcional"}
            </p>
          ))}
          <p className="field-hint">
            A conclusão depende da confirmação final do Instrutor após os
            critérios serem atingidos.
          </p>
        </>
      ) : (
        <p>
          Atividade legada: condições preservadas da versão anterior, sem
          frequência retroativa inventada.
        </p>
      )}
      {activity.assignments?.map((a, i) => (
        <p className="field-hint" key={i}>
          Reatribuição em {new Date(a.at).toLocaleDateString("pt-BR")}:{" "}
          {users.find((u) => u.id === a.from)?.name} →{" "}
          {users.find((u) => u.id === a.to)?.name}. Motivo: {a.reason}
        </p>
      ))}
    </section>
  );
}
