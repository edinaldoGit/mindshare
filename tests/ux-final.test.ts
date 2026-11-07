import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  enrollInActivity,
  confirmEnrollmentCompletion,
} from "../src/lib/demo/state.ts";
import {
  saveVideoProgress,
  validatedSeconds,
  saveMeetingAttendance,
  attendanceSummary,
  operateActivity,
} from "../src/lib/demo/evolution.ts";
import { parseDemoState, serializeDemoState } from "../src/lib/demo/storage.ts";
import {
  demoStudent as alex,
  demoLearner as julia,
  demoCurator as helena,
} from "../src/data/demo-data.ts";
import {
  studioLoginPath,
  loginPrefill,
} from "../src/features/demo-studio/studio-rules.ts";
const now = "2026-11-07T18:00:00.000Z";
function setup() {
  const state = enrollInActivity(
    createInitialState(),
    julia,
    "oficina-presencial",
    now,
    "ux-julia",
  ).state;
  const activity = state.activities.find((a) => a.id === "oficina-presencial")!;
  return { state, activity, meeting: activity.delivery!.meetings[0] };
}
const input = {
  date: now,
  subject: "Modelagem de casos de uso",
  records: { [julia.id]: true },
};
test("Encontro: assunto, data e presença são salvos atomicamente e persistem", () => {
  const { state, activity, meeting } = setup();
  const result = saveMeetingAttendance(
    state,
    alex,
    activity.id,
    meeting.id,
    input,
    now,
  );
  assert.ok(result.ok);
  const next = result.state.activities.find((a) => a.id === activity.id)!;
  assert.equal(next.delivery!.meetings[0].subject, input.subject);
  assert.equal(next.delivery!.meetings[0].updatedBy, alex.id);
  assert.equal(next.delivery!.meetings[0].date, now);
  assert.equal(next.delivery!.meetings[0].duration, meeting.duration);
  assert.equal(next.delivery!.minimum, activity.delivery!.minimum);
  assert.equal(attendanceSummary(result.state, next, julia.id).percent, 100);
  assert.ok(parseDemoState(serializeDemoState(result.state)));
});
for (const subject of ["", "   "])
  test(`Encontro: assunto vazio ${JSON.stringify(subject)} não produz efeitos parciais`, () => {
    const { state, activity, meeting } = setup();
    const result = saveMeetingAttendance(
      state,
      alex,
      activity.id,
      meeting.id,
      { ...input, subject },
      now,
    );
    assert.equal(result.ok, false);
    assert.equal(result.state, state);
  });
for (const date of ["", "inválida"])
  test(`Encontro: data inválida ${JSON.stringify(date)} é recusada`, () => {
    const { state, activity, meeting } = setup();
    assert.equal(
      saveMeetingAttendance(
        state,
        alex,
        activity.id,
        meeting.id,
        { ...input, date },
        now,
      ).ok,
      false,
    );
  });
for (const actor of [null, julia, helena])
  test(`Encontro: ${actor?.name ?? "visitante"} não modifica operação`, () => {
    const { state, activity, meeting } = setup();
    const result = saveMeetingAttendance(
      state,
      actor,
      activity.id,
      meeting.id,
      input,
      now,
    );
    assert.equal(result.ok, false);
    assert.equal(result.state, state);
  });
test("Encontro: não inscrito recusa lote inteiro", () => {
  const { state, activity, meeting } = setup();
  const result = saveMeetingAttendance(
    state,
    alex,
    activity.id,
    meeting.id,
    { ...input, records: { ...input.records, desconhecido: false } },
    now,
  );
  assert.equal(result.ok, false);
  assert.equal(result.state, state);
});
test("Encontro: ausência explícita conta; pendência removida não vira falta", () => {
  const { state, activity, meeting } = setup();
  const absent = saveMeetingAttendance(
    state,
    alex,
    activity.id,
    meeting.id,
    { ...input, records: { [julia.id]: false } },
    now,
  ).state;
  let a = absent.activities.find((a) => a.id === activity.id)!;
  assert.equal(attendanceSummary(absent, a, julia.id).percent, 0);
  const pending = saveMeetingAttendance(
    absent,
    alex,
    activity.id,
    meeting.id,
    { ...input, records: { [julia.id]: null } },
    now,
  ).state;
  a = pending.activities.find((a) => a.id === activity.id)!;
  const p = attendanceSummary(pending, a, julia.id);
  assert.equal(p.percent, null);
  assert.equal(p.count, 0);
  assert.equal(p.pending, 1);
});
test("Encontro: salvar novamente não duplica registros", () => {
  const { state, activity, meeting } = setup();
  const first = saveMeetingAttendance(
    state,
    alex,
    activity.id,
    meeting.id,
    input,
    now,
  ).state;
  const next = saveMeetingAttendance(
    first,
    alex,
    activity.id,
    meeting.id,
    input,
    now,
  ).state;
  assert.equal(
    next.attendance.filter(
      (r) => r.activityId === activity.id && r.meetingId === meeting.id,
    ).length,
    1,
  );
});
test("Encontro cancelado não recebe lançamento", () => {
  const { state, activity, meeting } = setup();
  const cancelled = operateActivity(
    state,
    alex,
    activity.id,
    meeting.id,
    "Cancelado",
  ).state;
  assert.equal(
    saveMeetingAttendance(cancelled, alex, activity.id, meeting.id, input, now)
      .ok,
    false,
  );
});
test("Conclusão exige encerramento e frequência; registro concluído não pode ser invalidado", () => {
  const { state, activity } = setup();
  let next = state;
  for (const m of activity.delivery!.meetings)
    next = saveMeetingAttendance(
      next,
      alex,
      activity.id,
      m.id,
      input,
      now,
    ).state;
  assert.equal(
    confirmEnrollmentCompletion(next, alex, "ux-julia", now).ok,
    false,
  );
  next = operateActivity(next, alex, activity.id, null, "Encerrada").state;
  const complete = confirmEnrollmentCompletion(next, alex, "ux-julia", now);
  assert.ok(complete.ok);
  assert.equal(
    saveMeetingAttendance(
      complete.state,
      alex,
      activity.id,
      activity.delivery!.meetings[0].id,
      { ...input, records: { [julia.id]: false } },
      now,
    ).ok,
    false,
  );
});
for (const user of [alex, julia, helena])
  test(`Studio: seleção de ${user.name} prepara login e destino sem alterar dados`, () => {
    const state = createInitialState();
    const before = serializeDemoState(state);
    const path = studioLoginPath(user);
    assert.ok(path.startsWith("/entrar?"));
    assert.equal(
      loginPrefill(
        "https://edinaldogit.github.io/mindshare/?demo=1#/",
        path.split("?")[1],
        state.users,
      ),
      user.email,
    );
    assert.equal(serializeDemoState(state), before);
  });
test("Snapshots v3 anteriores sem assunto continuam compatíveis", () => {
  assert.ok(parseDemoState(serializeDemoState(createInitialState())));
});

test("Persistência: assunto operacional malformado é recusado", () => {
  const state = createInitialState();
  const raw = JSON.parse(serializeDemoState(state));
  const activity = raw.activities.find(
    (a: { id: string }) => a.id === "oficina-presencial",
  );
  activity.delivery.meetings[0].subject = { invalid: true };
  assert.equal(parseDemoState(JSON.stringify(raw)), null);
});
test("Persistência: descrição de aula malformada é recusada", () => {
  const raw = JSON.parse(serializeDemoState(createInitialState()));
  const activity = raw.activities.find(
    (a: { id: string }) => a.id === "animacao-digital",
  );
  activity.delivery.lessons[0].description = { invalid: true };
  assert.equal(parseDemoState(JSON.stringify(raw)), null);
});

function pendingVideo() {
  let state = enrollInActivity(
    createInitialState(),
    julia,
    "animacao-digital",
    now,
    "ux-video",
  ).state;
  for (let i = 1; i <= 90; i++)
    state = saveVideoProgress(
      state,
      julia,
      "animacao-digital",
      "bbb-observacao",
      0,
      1,
      1,
      undefined,
      { watchedSinceCheck: i, pendingCheck: false },
    ).state;
  return saveVideoProgress(
    state,
    julia,
    "animacao-digital",
    "bbb-observacao",
    1,
    1,
    1,
    undefined,
    { watchedSinceCheck: 90, pendingCheck: true },
  ).state;
}
test("Vídeo: confirmação pendente persiste mesmo após reassistir o mesmo trecho", () => {
  const restored = parseDemoState(serializeDemoState(pendingVideo()))!;
  const p = restored.progress.find((p) => p.participantId === julia.id)!;
  assert.equal(p.pendingCheck, true);
  assert.equal(p.watchedSinceCheck, 90);
  assert.equal(validatedSeconds(p.intervals), 1);
  assert.equal(p.position, 1);
});
test("Vídeo: pendência impede novo crédito antes da confirmação", () => {
  const state = pendingVideo();
  const r = saveVideoProgress(
    state,
    julia,
    "animacao-digital",
    "bbb-observacao",
    1,
    2,
    2,
  );
  assert.equal(r.ok, false);
  assert.equal(r.state, state);
});
test("Vídeo: confirmação limpa pendência sem conceder segundos", () => {
  const r = saveVideoProgress(
    pendingVideo(),
    julia,
    "animacao-digital",
    "bbb-observacao",
    1,
    1,
    1,
    1,
  );
  assert.ok(r.ok);
  const p = r.state.progress.find((p) => p.participantId === julia.id)!;
  assert.equal(p.pendingCheck, false);
  assert.equal(p.watchedSinceCheck, 0);
  assert.equal(validatedSeconds(p.intervals), 1);
  assert.equal(p.checkpoints.length, 1);
});
test("Vídeo: tentativa de limpar pendência sem confirmar é recusada", () => {
  const state = pendingVideo();
  const r = saveVideoProgress(
    state,
    julia,
    "animacao-digital",
    "bbb-observacao",
    1,
    1,
    1,
    undefined,
    { watchedSinceCheck: 0, pendingCheck: false },
  );
  assert.equal(r.ok, false);
  assert.equal(r.state, state);
});
test("Vídeo: solicitação repetida de confirmação não duplica intervalos", () => {
  const state = pendingVideo();
  const r = saveVideoProgress(
    state,
    julia,
    "animacao-digital",
    "bbb-observacao",
    1,
    1,
    1,
    undefined,
    { watchedSinceCheck: 90, pendingCheck: true },
  );
  assert.ok(r.ok);
  assert.equal(
    validatedSeconds(
      r.state.progress.find((p) => p.participantId === julia.id)!.intervals,
    ),
    1,
  );
});
test("Vídeo: snapshot com contador de acompanhamento inválido é recusado", () => {
  const raw = JSON.parse(serializeDemoState(pendingVideo()));
  raw.progress.find(
    (p: { participantId: string }) => p.participantId === julia.id,
  ).watchedSinceCheck = -1;
  assert.equal(parseDemoState(JSON.stringify(raw)), null);
});
