import { useId } from "react";
import { Link } from "react-router-dom";
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
        <>
          <label className="instructor-field">
            Intervalo de confirmação de presença (min)
            <input
              type="number"
              min="5"
              max="10"
              value={d.checkIntervalMinutes ?? 5}
              onChange={(e) =>
                patch({ checkIntervalMinutes: Number(e.target.value) })
              }
            />
            <span className="field-hint">
              Referência configurável entre 5 e 10 minutos (prazo de resposta de
              30 segundos). Vídeos curtos ajustam a pausa proporcionalmente.
            </span>
          </label>
          <div className="learning-card">
            <h3>Playlist de videoaulas</h3>
            <p className="field-hint">
              Adicione uma ou mais aulas (ao menos uma obrigatória) para compor
              a atividade assíncrona.
            </p>
            {d.lessons.map((lesson, i) => (
              <div className="meeting-editor" key={lesson.id}>
                <label className="instructor-field">
                  Aula {i + 1} · título
                  <input
                    value={lesson.title}
                    placeholder="Ex.: Introdução ao tema"
                    onChange={(e) =>
                      patch({
                        lessons: d.lessons.map((x) =>
                          x.id === lesson.id
                            ? { ...x, title: e.target.value }
                            : x,
                        ),
                      })
                    }
                  />
                </label>
                <label className="instructor-field">
                  Breve descrição (opcional)
                  <input
                    value={lesson.description ?? ""}
                    placeholder="Resumo do conteúdo abordado na videoaula"
                    onChange={(e) =>
                      patch({
                        lessons: d.lessons.map((x) =>
                          x.id === lesson.id
                            ? { ...x, description: e.target.value }
                            : x,
                        ),
                      })
                    }
                  />
                </label>
                <label className="checkbox-field">
                  <input
                    type="checkbox"
                    checked={lesson.required}
                    onChange={(e) =>
                      patch({
                        lessons: d.lessons.map((x) =>
                          x.id === lesson.id
                            ? { ...x, required: e.target.checked }
                            : x,
                        ),
                      })
                    }
                  />{" "}
                  Aula obrigatória para conclusão (3 min)
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    patch({
                      lessons: d.lessons.filter((x) => x.id !== lesson.id),
                    })
                  }
                >
                  Remover aula {i + 1}
                </Button>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  patch({
                    lessons: [
                      ...d.lessons,
                      {
                        id:
                          d.lessons.length === 0 &&
                          !d.lessons.some((l) => l.id === demoLesson.id)
                            ? demoLesson.id
                            : `aula-${crypto.randomUUID().slice(0, 8)}`,
                        title:
                          d.lessons.length === 0
                            ? demoLesson.title
                            : `Aula ${d.lessons.length + 1}`,
                        description:
                          d.lessons.length === 0 ? demoLesson.description : "",
                        src: demoLesson.src,
                        duration: demoLesson.duration,
                        required: true,
                      },
                    ],
                  })
                }
              >
                Adicionar videoaula
              </Button>
            </div>
          </div>
        </>
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
  publicView = false,
}: {
  activity: Activity;
  showLink?: boolean;
  publicView?: boolean;
}) {
  const { users, user, enrollments } = useDemo();
  const d = activity.delivery;
  if (publicView && activity.format === "Remota assíncrona" && d) {
    const enrolled = enrollments.some(
      (e) => e.activityId === activity.id && e.participantId === user?.id,
    );
    return (
      <>
        <section className="learning-card">
          <p className="eyebrow">SEU APRENDIZADO</p>
          <h2>Conteúdo das aulas</h2>
          <ol className="public-playlist">
            {d.lessons.map((lesson, i) => (
              <li key={lesson.id}>
                <span className="lesson-number" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3>{lesson.title}</h3>
                  <p>
                    {lesson.description ||
                      "Explore o conteúdo desta aula e pratique os conceitos apresentados."}
                  </p>
                  <small>
                    {Math.round(lesson.duration / 60)} min ·{" "}
                    {lesson.required ? "Obrigatória" : "Opcional"} ·{" "}
                    {enrolled
                      ? "Disponível na sua área"
                      : "Acesso após inscrição"}
                  </small>
                </div>
              </li>
            ))}
          </ol>
          {enrolled && (
            <Link
              className="text-link"
              to={`/participante/atividades/${activity.id}/aulas`}
            >
              Acessar minhas aulas →
            </Link>
          )}
        </section>
        <section className="learning-card">
          <h2>Como funciona</h2>
          <p>
            Inscreva-se para acessar as aulas, acompanhe os vídeos e conclua os
            conteúdos obrigatórios. O instrutor confirmará a conclusão após o
            cumprimento dos critérios.
          </p>
          <p>
            <strong>Critérios de conclusão:</strong> {d.minimum}% de progresso
            validado no conteúdo obrigatório, com confirmações periódicas de
            acompanhamento (referência de {d.checkIntervalMinutes ?? 5} min ·
            prazo de 30 s).
          </p>
          {d.instructions && (
            <details>
              <summary>Orientações do instrutor</summary>
              <p>{d.instructions}</p>
            </details>
          )}
        </section>
      </>
    );
  }
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
              ? `progresso validado nos vídeos obrigatórios, com confirmação de acompanhamento (referência de ${d.checkIntervalMinutes ?? 5} min · prazo de 30 s)`
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
          Consulte as orientações da atividade diretamente com o Instrutor.
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
