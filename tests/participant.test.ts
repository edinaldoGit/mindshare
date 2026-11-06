import test from "node:test";
import assert from "node:assert/strict";
import {
  createInitialState,
  enrollInActivity,
  confirmEnrollmentCompletion,
} from "../src/lib/demo/state.ts";
import {
  serializeDemoState,
  parseDemoState,
  loadDemoState,
  saveDemoState,
  demoStorageKey,
  type DemoStorage,
} from "../src/lib/demo/storage.ts";
import { demoStudent, demoCurator, demoUsers } from "../src/data/demo-data.ts";
import {
  availableSeats,
  filterActivities,
  emptyFilters,
} from "../src/features/catalog/catalog-selectors.ts";
import {
  participantActivities,
  participantSummary,
  completedActivities,
  recommendActivities,
} from "../src/features/participant/participant-selectors.ts";
const now = "2026-11-05T01:00:00.000Z";
const enroll = (
  state = createInitialState(),
  activityId = "interfaces-figma",
  id = "nova-inscricao",
) => enrollInActivity(state, demoStudent, activityId, now, id);

test("RF18: inscrição válida pertence ao Discente correto e começa Inscrito", () => {
  const result = enroll();
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.enrollment.participantId, demoStudent.id);
  assert.equal(result.enrollment.status, "Inscrito");
  assert.equal(result.enrollment.enrolledAt, now);
});
test("RF18: disponibilidade diminui em uma unidade sem contador paralelo", () => {
  const state = createInitialState(),
    activity = state.activities[0];
  const before = availableSeats(activity, state.enrollments);
  const result = enroll(state);
  assert.ok(result.ok);
  assert.equal(availableSeats(activity, result.state.enrollments), before - 1);
  assert.equal(availableSeats(activity, state.enrollments), before);
});
test("RF18: catálogo, detalhe e dashboard usam a mesma alteração de estado", () => {
  const result = enroll();
  assert.ok(result.ok);
  const activity = filterActivities(
    result.state.activities,
    result.state.enrollments,
    emptyFilters,
  ).find((item) => item.id === "interfaces-figma")!;
  assert.equal(availableSeats(activity, result.state.enrollments), 6);
  assert.equal(
    participantSummary(result.state, demoUsers, demoStudent.id).enrollments,
    4,
  );
  assert.equal(
    participantActivities(result.state, demoUsers, demoStudent.id).find(
      (item) => item.activity.id === activity.id,
    )?.enrollment.status,
    "Inscrito",
  );
});
test("RF18: uma atividade sem vagas recusa sem alterar estado", () => {
  const state = createInitialState();
  const result = enroll(state, "sql-sem-misterio");
  assert.equal(result.ok, false);
  assert.equal(result.state, state);
});
test("RF18: inscrição duplicada, inclusive concluída, não consome outra vaga", () => {
  const state = createInitialState();
  for (const id of ["python-primeiros-passos", "web-acessivel"]) {
    const result = enroll(state, id);
    assert.equal(result.ok, false);
    assert.equal(result.state, state);
  }
  const once = enroll(state);
  const twice = enroll(once.state, "interfaces-figma", "outra");
  assert.equal(twice.ok, false);
  assert.equal(twice.state, once.state);
});
test("RF18: todas as propostas não aprovadas e IDs inexistentes são recusados", () => {
  const state = createInitialState();
  for (const id of [
    "proposta-interna-0",
    "proposta-interna-1",
    "proposta-interna-2",
    "proposta-interna-3",
    "inexistente",
  ]) {
    assert.equal(enroll(state, id).ok, false);
  }
});
test("RF18: visitante e Professor Curador não podem se inscrever", () => {
  const state = createInitialState();
  for (const actor of [null, demoCurator])
    assert.equal(
      enrollInActivity(state, actor, "interfaces-figma", now, "id").ok,
      false,
    );
});
test("RF18: dois comandos na última vaga não geram excedente", () => {
  const result = enroll(createInitialState(), "portfolio");
  assert.ok(result.ok);
  const another = demoUsers.find(
    (user) => user.id === "participante-exemplo-19",
  )!;
  const second = enrollInActivity(
    result.state,
    another,
    "portfolio",
    now,
    "segunda",
  );
  assert.equal(second.ok, false);
  assert.equal(
    availableSeats(
      result.state.activities.find((item) => item.id === "portfolio")!,
      second.state.enrollments,
    ),
    0,
  );
});
test("RF18: identificador repetido e data inválida são recusados", () => {
  const state = createInitialState();
  assert.equal(
    enrollInActivity(state, demoStudent, "interfaces-figma", "invalida", "nova")
      .ok,
    false,
  );
  assert.equal(
    enroll(state, "interfaces-figma", state.enrollments[0].id).ok,
    false,
  );
});
test("RF19: apenas inscrições do participante ativo, com os dois status oficiais", () => {
  const state = createInitialState(),
    items = participantActivities(state, demoUsers, demoStudent.id);
  assert.equal(items.length, 3);
  assert.ok(
    items.every((item) => item.enrollment.participantId === demoStudent.id),
  );
  assert.deepEqual(
    new Set(items.map((item) => item.enrollment.status)),
    new Set(["Inscrito", "Concluída"]),
  );
  assert.equal(
    participantActivities(state, demoUsers, "sem-inscricoes").length,
    0,
  );
});
test("RF21: histórico e total consideram apenas as duas conclusões iniciais", () => {
  const state = createInitialState();
  assert.equal(completedActivities(state, demoUsers, demoStudent.id).length, 2);
  assert.deepEqual(participantSummary(state, demoUsers, demoStudent.id), {
    enrollments: 3,
    completed: 2,
    hours: 10,
    certificates: 2,
  });
});
test("RF21: inscrição nova não soma horas nem libera comprovante", () => {
  const state = enroll().state;
  const summary = participantSummary(state, demoUsers, demoStudent.id);
  assert.equal(summary.enrollments, 4);
  assert.equal(summary.hours, 10);
  assert.equal(summary.certificates, 2);
});
test("Preparação RF20/RF21: confirmação válida do Instrutor reflete no histórico", () => {
  const state = createInitialState();
  const instructor = demoUsers.find((user) => user.id === "inst-caio")!;
  const result = confirmEnrollmentCompletion(
    state,
    instructor,
    "inscricao-python-primeiros-passos-0",
    now,
  );
  assert.ok(result.ok);
  assert.equal(
    participantSummary(result.state, demoUsers, demoStudent.id).hours,
    18,
  );
  assert.equal(
    participantSummary(result.state, demoUsers, demoStudent.id).certificates,
    3,
  );
});
test("Preparação RF20: Participante e Curador não confirmam conclusão", () => {
  const state = createInitialState();
  for (const user of [demoStudent, demoCurator, null])
    assert.equal(
      confirmEnrollmentCompletion(
        state,
        user,
        "inscricao-python-primeiros-passos-0",
        now,
      ).ok,
      false,
    );
});
test("Preparação RF20: conclusão é única, exige inscrito, instrutor responsável e data válida", () => {
  const state = createInitialState(),
    instructor = demoUsers.find((user) => user.id === "inst-caio")!;
  const once = confirmEnrollmentCompletion(
    state,
    instructor,
    "inscricao-python-primeiros-passos-0",
    now,
  );
  assert.ok(once.ok);
  assert.equal(
    confirmEnrollmentCompletion(
      once.state,
      instructor,
      "inscricao-python-primeiros-passos-0",
      now,
    ).ok,
    false,
  );
  assert.equal(
    confirmEnrollmentCompletion(state, instructor, "inexistente", now).ok,
    false,
  );
  assert.equal(
    confirmEnrollmentCompletion(
      state,
      instructor,
      "inscricao-python-primeiros-passos-0",
      "2020-01-01T00:00:00.000Z",
    ).ok,
    false,
  );
});
test("RF17: recomenda área exata e limite inclusivo de horas, somente aprovadas", () => {
  const state = createInitialState(),
    results = recommendActivities(state, demoStudent.id, "Design", 6);
  assert.equal(results.length, 2);
  assert.ok(
    results.every(
      (item) =>
        item.thematicArea === "Design" &&
        item.hours <= 6 &&
        item.status === "Aprovada",
    ),
  );
  assert.ok(results.some((item) => item.hours === 6));
});
test("RF17: exclusão de inscrições é opção de UX reversível", () => {
  const state = createInitialState();
  assert.equal(
    recommendActivities(state, demoStudent.id, "Programação", 8).length,
    1,
  );
  assert.equal(
    recommendActivities(state, demoStudent.id, "Programação", 8, false).length,
    2,
  );
});
test("RF17: nenhum resultado para limite pequeno, área ausente ou horas inválidas", () => {
  const state = createInitialState();
  for (const hours of [1, 0, -2, NaN, Infinity])
    assert.equal(
      recommendActivities(state, demoStudent.id, "Design", hours).length,
      0,
    );
  assert.equal(recommendActivities(state, demoStudent.id, "", 8).length, 0);
});
test("RF17: disponibilidade não é restrição adicional implícita", () => {
  assert.equal(
    recommendActivities(
      createInitialState(),
      demoStudent.id,
      "Banco de dados",
      10,
    )[0]?.id,
    "sql-sem-misterio",
  );
});
function memoryStorage(): DemoStorage {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
}
test("Persistência: alterações sobrevivem à serialização e recarregamento", () => {
  const storage = memoryStorage(),
    state = enroll().state;
  assert.ok(saveDemoState(storage, state));
  const loaded = loadDemoState(storage);
  assert.equal(loaded.notice, "");
  assert.deepEqual(loaded.state, state);
});
test("Persistência: payload versiona entidades fictícias e não guarda senha, arquivo pessoal ou sessão", () => {
  const serialized = serializeDemoState(createInitialState());
  const payload = JSON.parse(serialized);
  assert.deepEqual(Object.keys(payload), [
    "version",
    "activities",
    "enrollments",
    "users",
    "applications",
    "attendance",
    "progress",
  ]);
  assert.equal(payload.version, 3);
  assert.equal(/password|senha|participantName|base64/.test(serialized), false);
});
test("Persistência: vazio válido é preservado para demonstrar estados sem registros", () => {
  const state = createInitialState();
  state.enrollments = [];
  assert.deepEqual(parseDemoState(serializeDemoState(state))?.enrollments, []);
});
test("Persistência: JSON inválido, versão desconhecida e registros sem integridade falham com fallback", () => {
  const state = createInitialState();
  for (const raw of [
    "{",
    '{"version":2,"enrollments":[]}',
    JSON.stringify({
      version: 1,
      enrollments: [{ ...state.enrollments[0], participantId: "intruso" }],
    }),
    JSON.stringify({
      version: 1,
      enrollments: [state.enrollments[0], state.enrollments[0]],
    }),
  ]) {
    assert.equal(parseDemoState(raw), null);
    const storage = memoryStorage();
    storage.setItem(demoStorageKey, raw);
    assert.ok(loadDemoState(storage).notice);
    assert.deepEqual(loadDemoState(storage).state, createInitialState());
  }
});
test("Persistência: status, data de conclusão e capacidade são validados", () => {
  const state = createInitialState(),
    first = state.enrollments[0];
  for (const enrollment of [
    { ...first, status: "Em progresso" },
    { ...first, status: "Concluída", completedAt: "invalida" },
  ])
    assert.equal(
      parseDemoState(JSON.stringify({ version: 1, enrollments: [enrollment] })),
      null,
    );
  const activity = state.activities.find((item) => item.id === "portfolio")!;
  const overflow = Array.from(
    { length: activity.capacity + 1 },
    (_, index) => ({
      ...first,
      id: `over-${index}`,
      activityId: activity.id,
      participantId: `participante-exemplo-${index}`,
    }),
  );
  assert.equal(
    parseDemoState(JSON.stringify({ version: 1, enrollments: overflow })),
    null,
  );
});
test("Persistência: indisponibilidade e quota não impedem uso em memória", () => {
  const failing: DemoStorage = {
    getItem: () => {
      throw new Error("bloqueado");
    },
    setItem: () => {
      throw new Error("quota");
    },
  };
  assert.ok(loadDemoState(failing).notice);
  assert.ok(loadDemoState(null).notice);
  assert.equal(saveDemoState(failing, createInitialState()), false);
});
test("Reset: restaura o seed sem duplicatas e preserva dados externos ao armazenamento próprio", () => {
  const storage = memoryStorage();
  storage.setItem("outra-aplicacao", "preservado");
  saveDemoState(storage, enroll().state);
  saveDemoState(storage, createInitialState());
  saveDemoState(storage, createInitialState());
  const state = loadDemoState(storage).state;
  assert.deepEqual(state, createInitialState());
  assert.equal(
    new Set(state.enrollments.map((item) => item.id)).size,
    state.enrollments.length,
  );
  assert.equal(storage.getItem("outra-aplicacao"), "preservado");
});
