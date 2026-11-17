import { useState, type FormEvent } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
import { ConfirmationDialog } from "@/components/feedback/confirmation-dialog";
import {
  attendanceSummary,
  completionEligibility,
  operateActivity,
  saveMeetingAttendance,
} from "@/lib/demo/evolution";
import type { Activity, Meeting } from "@/types/domain";

function localDateTime(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
export function AttendancePage() {
  const { activityId } = useParams();
  const instructor = useLocation().pathname.startsWith("/instrutor");
  const { state, user, run } = useDemo();
  const [notice, setNotice] = useState<{ message: string; ok: boolean } | null>(
    null,
  );
  const [closing, setClosing] = useState(false);
  const [selected, setSelected] = useState("");
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
  const d = a.delivery;
  const meeting = d?.meetings.find((m) => m.id === selected) ?? d?.meetings[0];
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
          : instructor
            ? "Encontros e frequência"
            : "Minha frequência"}
      </h1>
      <p>{a.title}</p>
      {notice && (
        <FeedbackMessage error={!notice.ok}>{notice.message}</FeedbackMessage>
      )}
      {!d ? (
        <p>
          Esta atividade preserva os critérios da versão anterior, sem
          frequência retroativa.
        </p>
      ) : a.format === "Remota assíncrona" ? (
        <section className="learning-card">
          <h2>Acompanhamento individual</h2>
          {state.enrollments
            .filter((e) => e.activityId === a.id)
            .map((e) => (
              <article className="attendance-person" key={e.id}>
                <h3>
                  {state.users.find((u) => u.id === e.participantId)?.name}
                </h3>
                <p>{completionEligibility(state, a, e.participantId).reason}</p>
              </article>
            ))}
        </section>
      ) : (
        <>
          <section className="learning-card">
            <h2>
              {instructor ? "Selecione o dia do encontro" : "Seus encontros"}
            </h2>
            <p>
              Frequência mínima: <strong>{d.minimum}%</strong>.{" "}
              {a.format === "Presencial"
                ? `Local: ${d.location}`
                : "Encontro remoto ao vivo."}
            </p>
            {a.format === "Remota síncrona" && d.link && (
              <p>
                <a href={d.link} target="_blank" rel="noopener noreferrer">
                  Acessar reunião ↗
                </a>
              </p>
            )}
            {instructor ? (
              <>
                <label className="instructor-field">
                  Encontro
                  <select
                    value={meeting?.id ?? ""}
                    onChange={(e) => {
                      setSelected(e.target.value);
                      setNotice(null);
                    }}
                  >
                    {d.meetings.map((m, i) => (
                      <option key={m.id} value={m.id}>
                        Encontro {i + 1} ·{" "}
                        {new Date(m.date).toLocaleString("pt-BR")} · {m.status}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="field-hint">
                  Confirme o dia e o assunto, marque as presenças e salve.
                  Duração, local, modalidade e mínimo seguem o planejamento
                  aprovado. Novos encontros que alterem esse planejamento exigem
                  nova curadoria.
                </p>
                {meeting && (
                  <MeetingEditor
                    key={`${a.id}:${meeting.id}:${meeting.updatedAt ?? meeting.status}`}
                    activity={a}
                    meeting={meeting}
                    onResult={setNotice}
                  />
                )}
                {!d.closed && (
                  <Button variant="outline" onClick={() => setClosing(true)}>
                    Encerrar atividade
                  </Button>
                )}
                {d.closed && (
                  <p>
                    Atividade encerrada. Confira a elegibilidade e confirme as
                    conclusões na gestão de participantes.
                  </p>
                )}
              </>
            ) : (
              <>
                <AttendanceSummary activity={a} participantId={user.id} />
                {d.meetings.map((m, i) => {
                  const r = state.attendance.find(
                    (r) =>
                      r.activityId === a.id &&
                      r.meetingId === m.id &&
                      r.participantId === user.id,
                  );
                  return (
                    <article className="meeting-card" key={m.id}>
                      <h3>Encontro {i + 1}</h3>
                      <p>
                        {new Date(m.date).toLocaleString("pt-BR")} ·{" "}
                        {m.duration} min · {m.status}
                      </p>
                      <p>
                        <strong>Assunto abordado:</strong>{" "}
                        {m.subject ||
                          "O instrutor ainda não informou o assunto deste encontro."}
                      </p>
                      <p>
                        <strong>
                          {m.status === "Cancelado"
                            ? "Cancelado · não contabilizado"
                            : m.status !== "Realizado" || !r
                              ? "Não registrado"
                              : r.present
                                ? "Presente"
                                : "Ausente"}
                        </strong>
                      </p>
                      {r && (
                        <small>
                          Atualizado em{" "}
                          {new Date(r.recordedAt).toLocaleString("pt-BR")}
                        </small>
                      )}
                    </article>
                  );
                })}
              </>
            )}
          </section>
          {instructor && (
            <section className="learning-card">
              <h2>Frequência acumulada dos participantes</h2>
              {state.enrollments
                .filter((e) => e.activityId === a.id)
                .map((e) => (
                  <article className="attendance-person" key={e.id}>
                    <h3>
                      {state.users.find((u) => u.id === e.participantId)?.name}
                    </h3>
                    <AttendanceSummary
                      activity={a}
                      participantId={e.participantId}
                    />
                  </article>
                ))}
            </section>
          )}
        </>
      )}
      <ConfirmationDialog
        open={closing}
        onClose={() => setClosing(false)}
        onConfirm={() => {
          setNotice(
            run((s, u) => operateActivity(s, u, a.id, null, "Encerrada")),
          );
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
function AttendanceSummary({
  activity,
  participantId,
}: {
  activity: Activity;
  participantId: string;
}) {
  const { state } = useDemo();
  const p = attendanceSummary(state, activity, participantId);
  const future = activity.delivery?.meetings.some(
    (m) => m.status === "Planejado",
  );
  const partial = !p.closed || p.pending > 0 || future;
  return (
    <div className="attendance-summary">
      <p>
        <strong>
          Frequência acumulada:{" "}
          {p.percent === null ? "sem dados" : `${p.percent.toFixed(1)}%`}
        </strong>{" "}
        · mínimo {p.minimum}%
      </p>
      <p>
        {p.present} presença(s) em {p.count} encontro(s) registrado(s) ·{" "}
        {p.count - p.present} ausência(s) · {p.pending} registro(s) pendente(s).
      </p>
      <p>
        {partial
          ? "Acompanhamento parcial. Encontros futuros e registros pendentes não contam como ausência."
          : p.percent !== null && p.percent >= p.minimum
            ? "Critério de frequência atendido. A confirmação final cabe ao Instrutor."
            : "O critério de frequência ainda não foi atendido. Consulte o Instrutor."}
      </p>
    </div>
  );
}
function MeetingEditor({
  activity,
  meeting,
  onResult,
}: {
  activity: Activity;
  meeting: Meeting;
  onResult: (r: { message: string; ok: boolean }) => void;
}) {
  const { state, run } = useDemo();
  const participants = state.enrollments.filter(
    (e) => e.activityId === activity.id,
  );
  const [date, setDate] = useState(localDateTime(meeting.date));
  const [subject, setSubject] = useState(meeting.subject ?? "");
  const [records, setRecords] = useState<Record<string, boolean | null>>(() =>
    Object.fromEntries(
      participants.map((e) => [
        e.participantId,
        state.attendance.find(
          (r) =>
            r.activityId === activity.id &&
            r.meetingId === meeting.id &&
            r.participantId === e.participantId,
        )?.present ?? null,
      ]),
    ),
  );
  const cancelled = meeting.status === "Cancelado";
  function save(event: FormEvent) {
    event.preventDefault();
    onResult(
      run((s, u) =>
        saveMeetingAttendance(
          s,
          u,
          activity.id,
          meeting.id,
          { date: date ? new Date(date).toISOString() : "", subject, records },
          new Date().toISOString(),
        ),
      ),
    );
  }
  return (
    <form onSubmit={save} className="meeting-register">
      <h3>
        {meeting.status} · {meeting.duration} minutos
      </h3>
      <label className="instructor-field">
        Data e horário do encontro
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={cancelled}
        />
      </label>
      <label className="instructor-field">
        Assunto abordado
        <textarea
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          rows={3}
          required
          disabled={cancelled}
          placeholder="Ex.: Modelagem de casos de uso e identificação de atores."
        />
      </label>
      <h3>Participantes inscritos</h3>
      {!participants.length && (
        <p>
          Ainda não há participantes inscritos. Você pode registrar o assunto do
          encontro.
        </p>
      )}
      {participants.map((e) => (
        <fieldset
          className="attendance-person"
          key={e.id}
          disabled={cancelled || e.status === "Concluída"}
        >
          <legend>
            {state.users.find((u) => u.id === e.participantId)?.name}
          </legend>
          <div className="attendance-options">
            {(
              [
                ["Presente", true],
                ["Ausente", false],
                ["Não registrado", null],
              ] as const
            ).map(([label, value]) => (
              <label key={label}>
                <input
                  type="radio"
                  name={`presence-${meeting.id}-${e.participantId}`}
                  checked={records[e.participantId] === value}
                  onChange={() =>
                    setRecords({ ...records, [e.participantId]: value })
                  }
                />{" "}
                {label}
              </label>
            ))}
          </div>
          {e.status === "Concluída" && (
            <p>Conclusão já confirmada; frequência preservada.</p>
          )}
        </fieldset>
      ))}
      {!cancelled && (
        <Button type="submit">Salvar encontro e frequência</Button>
      )}
      {meeting.status === "Planejado" && (
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            onResult(
              run((s, u) =>
                operateActivity(s, u, activity.id, meeting.id, "Cancelado"),
              ),
            )
          }
        >
          Cancelar este encontro
        </Button>
      )}
      {meeting.updatedAt && (
        <p className="field-hint">
          Último lançamento:{" "}
          {new Date(meeting.updatedAt).toLocaleString("pt-BR")}
        </p>
      )}
    </form>
  );
}
