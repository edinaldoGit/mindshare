import { emptyDelivery } from "../src/lib/demo/evolution.ts";
import assert from "node:assert/strict";
import test from "node:test";
import {
  demoCurator,
  demoLearner,
  demoStudent,
  demoUsers,
} from "../src/data/demo-data.ts";
import {
  approveProposal,
  confirmEnrollmentCompletion,
  createInitialState,
  createProposal,
  proposalInputErrors,
  submitProposal,
  updateProposal,
  type ProposalInput,
} from "../src/lib/demo/state.ts";
import { isPublished } from "../src/lib/policies.ts";
import { availableSeats } from "../src/features/catalog/catalog-selectors.ts";
import {
  demoStorageKey,
  legacyDemoStorageKey,
  loadDemoState,
  saveDemoState,
  type DemoStorage,
} from "../src/lib/demo/storage.ts";
import {
  activityParticipants,
  approvedInstructorActivities,
  instructorProposals,
  instructorSummary,
} from "../src/features/instructor/instructor-selectors.ts";
import {
  completedActivities,
  participantSummary,
} from "../src/features/participant/participant-selectors.ts";
import { certificateData } from "../src/features/certificates/certificate-data.ts";

const validInput: ProposalInput = {
  curatorId: demoCurator.id,
  delivery: {
    ...emptyDelivery(),
    link: "https://example.org/aula",
    meetings: [
      {
        id: "test-meeting",
        date: "2026-11-05T10:00:00.000Z",
        duration: 60,
        status: "Planejado",
      },
    ],
  },
  title: "Oficina de protótipos colaborativos",
  syllabus: "Pratique hierarquia visual, componentes e prototipação em grupo.",
  hours: 5,
  format: "Remoto",
  category: "Formação complementar — exemplo",
  capacity: 14,
  thematicArea: "Design de interação",
  activityType: "Oficina",
};
const created = (input = validInput) =>
  createProposal(
    createInitialState(),
    demoStudent,
    input,
    "2026-11-05T12:00:00.000Z",
    "proposta-nova-teste",
  );

test("RF04: cria proposta completa como rascunho ligada ao Discente atual", () => {
  const result = created();
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.activity.status, "Rascunho");
  assert.equal(result.activity.instructorId, demoStudent.id);
  assert.equal(result.activity.createdAt, "2026-11-05T12:00:00.000Z");
  assert.equal(result.activity.syllabus, validInput.syllabus);
});

test("RF04: valida texto em branco, números positivos e opções disponíveis", () => {
  for (const key of Object.keys(validInput).filter(
    (k) => !["curatorId", "delivery"].includes(k),
  ) as Array<keyof ProposalInput>) {
    const invalid = {
      ...validInput,
      [key]: key === "hours" || key === "capacity" ? 0 : "   ",
    } as ProposalInput;
    assert.ok(proposalInputErrors(invalid)[key], `campo ${key}`);
    assert.equal(created(invalid).ok, false);
  }
  assert.ok(proposalInputErrors({ ...validInput, hours: Number.NaN }).hours);
  assert.ok(proposalInputErrors({ ...validInput, capacity: 2.5 }).capacity);
  assert.ok(proposalInputErrors({ ...validInput, format: "Híbrido" }).format);
  assert.ok(
    proposalInputErrors({
      ...validInput,
      activityType: "Congresso" as ProposalInput["activityType"],
    }).activityType,
  );
});

test("RF04: recusa Professor Curador, ID repetido e data inválida", () => {
  assert.equal(
    createProposal(
      createInitialState(),
      demoCurator,
      validInput,
      "2026-11-05T12:00:00.000Z",
      "novo",
    ).ok,
    false,
  );
  assert.equal(
    createProposal(
      createInitialState(),
      demoStudent,
      validInput,
      "inválida",
      "novo",
    ).ok,
    false,
  );
  assert.equal(
    createProposal(
      createInitialState(),
      demoStudent,
      validInput,
      "2026-11-05T12:00:00.000Z",
      "atividade-alex-oficina",
    ).ok,
    false,
  );
});

test("RF05: submissão registra data, preserva autoria e aguarda curadoria", () => {
  const result = created();
  assert.ok(result.ok);
  if (!result.ok) return;
  const submitted = submitProposal(
    result.state,
    demoStudent,
    result.activity.id,
    "2026-11-05T13:00:00.000Z",
  );
  assert.ok(submitted.ok);
  if (!submitted.ok) return;
  assert.equal(submitted.activity.status, "Em análise");
  assert.equal(submitted.activity.instructorId, demoStudent.id);
  assert.equal(submitted.activity.submittedAt, "2026-11-05T13:00:00.000Z");
  assert.equal(isPublished(submitted.activity), false);
  assert.equal(
    submitProposal(
      submitted.state,
      demoStudent,
      submitted.activity.id,
      "2026-11-05T14:00:00.000Z",
    ).ok,
    false,
  );
});

test("RF05: só o proprietário submete; propostas de outros estados são recusadas", () => {
  const state = createInitialState();
  assert.equal(
    submitProposal(
      state,
      demoCurator,
      "proposta-alex-rascunho",
      "2026-11-05T12:00:00.000Z",
    ).ok,
    false,
  );
  assert.equal(
    submitProposal(
      state,
      demoLearner,
      "proposta-alex-rascunho",
      "2026-11-05T12:00:00.000Z",
    ).ok,
    false,
  );
  for (const id of [
    "proposta-alex-analise",
    "proposta-alex-rejeitada",
    "atividade-alex-oficina",
  ])
    assert.equal(
      submitProposal(state, demoStudent, id, "2026-11-05T12:00:00.000Z").ok,
      false,
    );
});

test("RF10: apenas Ajustes solicitados aceita atualização e preserva justificativa", () => {
  const state = createInitialState();
  const proposal = state.activities.find(
    (item) => item.id === "proposta-alex-ajustes",
  )!;
  const result = updateProposal(state, demoStudent, proposal.id, {
    ...validInput,
    title: "Design acessível revisado",
  });
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.activity.status, "Ajustes solicitados");
  assert.equal(result.activity.decisions[0].outcome, "Ajustes solicitados");
  assert.equal(
    updateProposal(state, demoLearner, proposal.id, validInput).ok,
    false,
  );
  for (const item of state.activities.filter(
    (activity) =>
      activity.instructorId === demoStudent.id &&
      activity.status !== "Ajustes solicitados",
  ))
    assert.equal(
      updateProposal(state, demoStudent, item.id, validInput).ok,
      false,
      item.status,
    );
  assert.equal(
    updateProposal(state, demoStudent, proposal.id, {
      ...validInput,
      syllabus: " ",
    }).ok,
    false,
  );
});

test("Reenvio após ajuste retorna a Em análise sem apagar decisão anterior", () => {
  const state = createInitialState(),
    proposal = state.activities.find(
      (item) => item.id === "proposta-alex-ajustes",
    )!;
  const update = updateProposal(state, demoStudent, proposal.id, validInput);
  assert.ok(update.ok);
  if (!update.ok) return;
  const resubmitted = submitProposal(
    update.state,
    demoStudent,
    proposal.id,
    "2026-11-05T15:00:00.000Z",
  );
  assert.ok(resubmitted.ok);
  if (!resubmitted.ok) return;
  assert.equal(resubmitted.activity.status, "Em análise");
  assert.equal(
    resubmitted.activity.decisions[0].outcome,
    "Ajustes solicitados",
  );
});

test("Serviço futuro de curadoria aprova no mesmo registro e o catálogo filtra por status", () => {
  const createdResult = created();
  assert.ok(createdResult.ok);
  if (!createdResult.ok) return;
  const submitted = submitProposal(
    createdResult.state,
    demoStudent,
    createdResult.activity.id,
    "2026-11-05T13:00:00.000Z",
  );
  assert.ok(submitted.ok);
  if (!submitted.ok) return;
  assert.equal(
    approveProposal(
      submitted.state,
      demoStudent,
      submitted.activity.id,
      "2026-11-05T14:00:00.000Z",
      "decisão-falsa",
    ).ok,
    false,
  );
  const approved = approveProposal(
    submitted.state,
    demoCurator,
    submitted.activity.id,
    "2026-11-05T14:00:00.000Z",
    "decisao-teste",
  );
  assert.ok(approved.ok);
  if (!approved.ok) return;
  assert.equal(approved.activity.status, "Aprovada");
  assert.ok(isPublished(approved.activity));
  assert.equal(
    approvedInstructorActivities(approved.state, demoStudent.id).some(
      (item) => item.id === approved.activity.id,
    ),
    true,
  );
});

test("RF20: atividade aprovada do próprio Instrutor lista participantes reais", () => {
  const state = createInitialState();
  const members = activityParticipants(
    state,
    demoUsers,
    "atividade-alex-oficina",
  );
  assert.equal(members.length, 1);
  assert.equal(members[0].participant.id, demoLearner.id);
  assert.equal(members[0].enrollment.status, "Inscrito");
  assert.equal(
    activityParticipants(state, demoUsers, "algoritmos").length,
    state.enrollments.filter((item) => item.activityId === "algoritmos").length,
  );
  assert.equal(
    activityParticipants(state, demoUsers, "atividade-alex-sem-inscritos")
      .length,
    0,
  );
});

test("RF20: conclusão por Instrutor atualiza uma inscrição, horas e PDF do Participante", () => {
  const state = createInitialState();
  const beforeSeats = availableSeats(
    state.activities.find((item) => item.id === "atividade-alex-oficina")!,
    state.enrollments,
  );
  const beforeHours = participantSummary(
    state,
    demoUsers,
    demoLearner.id,
  ).hours;
  const enrollment = state.enrollments.find(
    (item) => item.id === "inscricao-julia-atividade-alex",
  )!;
  const result = confirmEnrollmentCompletion(
    state,
    demoStudent,
    enrollment.id,
    "2026-11-05T16:00:00.000Z",
  );
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.enrollment.status, "Concluída");
  assert.equal(
    completedActivities(result.state, demoUsers, demoLearner.id).length,
    1,
  );
  assert.equal(
    participantSummary(result.state, demoUsers, demoLearner.id).hours,
    beforeHours + 6,
  );
  assert.equal(
    certificateData(
      result.state,
      demoUsers,
      demoLearner,
      enrollment.id,
      "2026-11-05T17:00:00.000Z",
    )?.activityTitle,
    "Interfaces colaborativas: da ideia ao protótipo",
  );
  assert.equal(
    availableSeats(
      result.state.activities.find(
        (item) => item.id === "atividade-alex-oficina",
      )!,
      result.state.enrollments,
    ),
    beforeSeats,
  );
  assert.equal(
    confirmEnrollmentCompletion(
      result.state,
      demoStudent,
      enrollment.id,
      "2026-11-05T17:00:00.000Z",
    ).ok,
    false,
  );
});

test("RF20: impede auto conclusão, Curador, atividade alheia ou não aprovada", () => {
  const state = createInitialState();
  const enrollment = state.enrollments.find(
    (item) => item.id === "inscricao-julia-atividade-alex",
  )!;
  assert.equal(
    confirmEnrollmentCompletion(
      state,
      demoLearner,
      enrollment.id,
      "2026-11-05T16:00:00.000Z",
    ).ok,
    false,
  );
  assert.equal(
    confirmEnrollmentCompletion(
      state,
      demoCurator,
      enrollment.id,
      "2026-11-05T16:00:00.000Z",
    ).ok,
    false,
  );
  assert.equal(
    confirmEnrollmentCompletion(
      state,
      { ...demoStudent, id: "outro-instrutor" },
      enrollment.id,
      "2026-11-05T16:00:00.000Z",
    ).ok,
    false,
  );
  assert.equal(
    confirmEnrollmentCompletion(
      state,
      demoStudent,
      "inscricao-python-primeiros-passos-0",
      "2026-11-05T16:00:00.000Z",
    ).ok,
    false,
  );
  const unapproved = {
    ...state,
    activities: state.activities.map((item) =>
      item.id === "atividade-alex-oficina"
        ? { ...item, status: "Em análise" as const }
        : item,
    ),
  };
  assert.equal(
    confirmEnrollmentCompletion(
      unapproved,
      demoStudent,
      enrollment.id,
      "2026-11-05T16:00:00.000Z",
    ).ok,
    false,
  );
});

test("Dashboard e atividades mostram apenas propostas e aprovações do Discente atual", () => {
  const state = createInitialState(),
    summary = instructorSummary(state, demoStudent.id);
  assert.equal(summary.proposals, 9);
  assert.equal(summary.reviewing, 1);
  assert.equal(summary.approved, 5);
  assert.equal(summary.participants, 1);
  assert.equal(instructorProposals(state, demoLearner.id).length, 0);
  assert.deepEqual(
    approvedInstructorActivities(state, demoStudent.id).map((item) => item.id),
    [
      "atividade-alex-oficina",
      "atividade-alex-sem-inscritos",
      "oficina-presencial",
      "oficina-sincrona",
      "animacao-digital",
    ],
  );
});

test("Migração v1→v2 conserva inscrições anteriores e adiciona a amostra nova sem apagar o legado", () => {
  const values = new Map<string, string>();
  const storage: DemoStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
  };
  const legacyEnrollments = createInitialState().enrollments.filter(
    (item) => item.activityId !== "atividade-alex-oficina",
  );
  const legacy = JSON.stringify({ version: 1, enrollments: legacyEnrollments });
  storage.setItem(legacyDemoStorageKey, legacy);
  const loaded = loadDemoState(storage);
  assert.match(loaded.notice, /preservando/);
  assert.equal(loaded.state.version, 3);
  assert.equal(
    loaded.state.enrollments.some(
      (item) => item.id === "inscricao-python-primeiros-passos-0",
    ),
    true,
  );
  assert.equal(
    loaded.state.enrollments.some(
      (item) => item.id === "inscricao-julia-atividade-alex",
    ),
    true,
  );
  assert.equal(storage.getItem(legacyDemoStorageKey), legacy);
  assert.ok(storage.getItem(demoStorageKey));
});

test("Persistência v2 guarda propostas e permissões após reload", () => {
  const values = new Map<string, string>(),
    storage: DemoStorage = {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => {
        values.set(key, value);
      },
    };
  const state = createInitialState();
  const createdResult = createProposal(
    state,
    demoStudent,
    validInput,
    "2026-11-05T12:00:00.000Z",
    "proposal-persisted",
  );
  assert.ok(createdResult.ok);
  if (!createdResult.ok) return;
  assert.ok(saveDemoState(storage, createdResult.state));
  const reload = loadDemoState(storage);
  assert.equal(
    reload.state.activities.find((item) => item.id === "proposal-persisted")
      ?.instructorId,
    demoStudent.id,
  );
  assert.equal(
    reload.state.enrollments.some(
      (item) => item.id === "inscricao-julia-atividade-alex",
    ),
    true,
  );
});
