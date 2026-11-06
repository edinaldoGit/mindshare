import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
import { ConfirmationDialog } from "@/components/feedback/confirmation-dialog";
import {
  attendanceSummary,
  completionEligibility,
  operateActivity,
  recordAttendance,
} from "@/lib/demo/evolution";
import { DeliveryInfo } from "./delivery-fields";
export function AttendancePage() {
  const { activityId } = useParams();
  const location = useLocation();
  const instructor = location.pathname.startsWith("/instrutor");
  const { state, user, users, run } = useDemo();
  const [notice, setNotice] = useState("");
  const [closing, setClosing] = useState(false);
  const a = state.activities.find(
    (a) =>
      a.id === activityId &&
      a.status === "Aprovada" &&
      (instructor
        ? a.instructorId === user?.id
        : state.enrollments.some(
            (e) => e.activityId === a.id && e.participantId === user?.id,
          )),
  );
  if (!a || !user)
    return (
      <section className="instructor-page">
        <h1>Acompanhamento indisponível</h1>
        <p>Consulte uma atividade do seu espaço.</p>
      </section>
    );
  const participants = state.enrollments.filter(
    (e) => e.activityId === a.id && (instructor || e.participantId === user.id),
  );
  const d = a.delivery;
  function result(r: { message: string }) {
    setNotice(r.message);
  }
  return (
    <div className="instructor-page learning-page">
      <Link
        to={
          instructor
            ? `/instrutor/atividades/${a.id}/participantes`
            : `/participante/atividades/${a.id}`
        }
      >
        ← Voltar à atividade
      </Link>
      <p className="eyebrow">{a.format}</p>
      <h1>
        {a.format === "Remota assíncrona"
          ? "Progresso dos participantes"
          : "Frequência e encontros"}
      </h1>
      <p>{a.title}</p>
      <DeliveryInfo activity={a} showLink />
      {notice && <FeedbackMessage>{notice}</FeedbackMessage>}
      {d && a.format !== "Remota assíncrona" && (
        <>
          <div className="learning-card">
            <h2>Planejamento dos encontros</h2>
            {d.meetings.map((m, i) => (
              <article className="meeting-card" key={m.id}>
                <div>
                  <h3>Encontro {i + 1}</h3>
                  <p>
                    {new Date(m.date).toLocaleString("pt-BR")} · {m.duration}{" "}
                    min · <strong>{m.status}</strong>
                  </p>
                </div>
                {instructor && m.status === "Planejado" && (
                  <div className="learning-actions">
                    <Button
                      variant="outline"
                      onClick={() =>
                        result(
                          run((s, u) =>
                            operateActivity(s, u, a.id, m.id, "Realizado"),
                          ),
                        )
                      }
                    >
                      Marcar encontro {i + 1} realizado
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        result(
                          run((s, u) =>
                            operateActivity(s, u, a.id, m.id, "Cancelado"),
                          ),
                        )
                      }
                    >
                      Cancelar encontro {i + 1}
                    </Button>
                  </div>
                )}
              </article>
            ))}
            {instructor && !d.closed && (
              <Button variant="outline" onClick={() => setClosing(true)}>
                Encerrar atividade
              </Button>
            )}
            {d.closed && (
              <p>
                Atividade encerrada. A conclusão de cada participante depende do
                mínimo e da confirmação do Instrutor.
              </p>
            )}
          </div>
        </>
      )}
      <section className="learning-card">
        <h2>{instructor ? "Participação individual" : "Seu acompanhamento"}</h2>
        {!participants.length && <p>Ainda não há participantes inscritos.</p>}
        {participants.map((e) => {
          const p = attendanceSummary(state, a, e.participantId);
          return (
            <article className="attendance-person" key={e.id}>
              <h3>{users.find((u) => u.id === e.participantId)?.name}</h3>
              <p>{completionEligibility(state, a, e.participantId).reason}</p>
              {a.format !== "Remota assíncrona" && (
                <>
                  <p>
                    {p.present} presença(s) em {p.count} encontro(s)
                    contabilizado(s). Registros ainda não lançados não são
                    faltas.
                  </p>
                  {d?.meetings.map((m, i) => {
                    const r = state.attendance.find(
                      (r) =>
                        r.activityId === a.id &&
                        r.meetingId === m.id &&
                        r.participantId === e.participantId,
                    );
                    return (
                      <div className="attendance-row" key={m.id}>
                        <span>
                          Encontro {i + 1} ·{" "}
                          <strong>
                            {r
                              ? r.present
                                ? "Presente"
                                : "Ausente"
                              : "Não registrado"}
                          </strong>{" "}
                          · {m.status}
                        </span>
                        {instructor && m.status === "Realizado" && (
                          <div className="learning-actions">
                            <Button
                              variant={r?.present ? "default" : "outline"}
                              aria-pressed={r?.present === true}
                              onClick={() =>
                                result(
                                  run((s, u) =>
                                    recordAttendance(
                                      s,
                                      u,
                                      a.id,
                                      m.id,
                                      e.participantId,
                                      true,
                                      new Date().toISOString(),
                                    ),
                                  ),
                                )
                              }
                            >
                              Presente · {i + 1}
                            </Button>
                            <Button
                              variant={
                                r?.present === false ? "default" : "outline"
                              }
                              aria-pressed={r?.present === false}
                              onClick={() =>
                                result(
                                  run((s, u) =>
                                    recordAttendance(
                                      s,
                                      u,
                                      a.id,
                                      m.id,
                                      e.participantId,
                                      false,
                                      new Date().toISOString(),
                                    ),
                                  ),
                                )
                              }
                            >
                              Ausente · {i + 1}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </article>
          );
        })}
      </section>
      <ConfirmationDialog
        open={closing}
        onClose={() => setClosing(false)}
        onConfirm={() => {
          result(run((s, u) => operateActivity(s, u, a.id, null, "Encerrada")));
          setClosing(false);
        }}
        title="Encerrar esta atividade?"
        description="Todos os encontros precisam estar realizados ou cancelados. Encerrar não confirma automaticamente nenhuma conclusão."
        confirmLabel="Confirmar encerramento"
        cancelLabel="Voltar"
        eyebrow="ENCERRAMENTO"
      />
    </div>
  );
}
