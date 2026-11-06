import {
  emptyDelivery,
  recordAttendance,
  operateActivity,
} from "../src/lib/demo/evolution.ts";
import test from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import {
  demoCurator,
  demoLearner,
  demoStudent,
  demoUsers,
} from "../src/data/demo-data.ts";
import type { DemoState, User } from "../src/types/domain.ts";
import {
  approveProposal,
  rejectProposal,
  requestProposalAdjustments,
  createInitialState,
  createProposal,
  submitProposal,
  updateProposal,
  enrollInActivity,
  confirmEnrollmentCompletion,
  type ProposalInput,
  type ProposalCommandResult,
} from "../src/lib/demo/state.ts";
import {
  curationHistory,
  curationSummary,
  pendingProposals,
  proposalEvents,
} from "../src/features/curation/curation-selectors.ts";
import {
  emptyFilters,
  filterActivities,
  availableSeats,
} from "../src/features/catalog/catalog-selectors.ts";
import { participantSummary } from "../src/features/participant/participant-selectors.ts";
import { certificateData } from "../src/features/certificates/certificate-data.ts";
import { generateCertificatePdf } from "../src/features/certificates/certificate-pdf.ts";
import {
  demoStorageKey,
  loadDemoState,
  parseDemoState,
  serializeDemoState,
  saveDemoState,
} from "../src/lib/demo/storage.ts";
const input: ProposalInput = {
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
  title: "Oficina de revisão colaborativa",
  syllabus: "Leitura e revisão de argumentos em resumos científicos.",
  hours: 5,
  capacity: 9,
  format: "Remoto",
  thematicArea: "Comunicação científica",
  category: "Formação complementar — exemplo",
  activityType: "Oficina",
};
const at = (hour: number) =>
  `2026-11-05T${String(hour).padStart(2, "0")}:00:00.000Z`;
function success(result: ProposalCommandResult) {
  assert.ok(result.ok, result.message);
  if (!result.ok) throw Error(result.message);
  return result;
}
function submitted() {
  const created = success(
    createProposal(
      createInitialState(),
      demoStudent,
      input,
      at(10),
      "proposta-ciclo",
    ),
  );
  return success(
    submitProposal(created.state, demoStudent, created.activity.id, at(11)),
  );
}
const operations = [
  {
    name: "aprovação",
    outcome: "Aprovada",
    run: (
      s: DemoState,
      actor: User | null,
      id: string,
      date = at(12),
      decisionId = "decisao-aprovacao",
    ) => approveProposal(s, actor, id, date, decisionId),
  },
  {
    name: "rejeição",
    outcome: "Rejeitada",
    run: (
      s: DemoState,
      actor: User | null,
      id: string,
      date = at(12),
      decisionId = "decisao-rejeicao",
    ) =>
      rejectProposal(
        s,
        actor,
        id,
        "  Reorganize o escopo.  ",
        date,
        decisionId,
      ),
  },
  {
    name: "ajustes",
    outcome: "Ajustes solicitados",
    run: (
      s: DemoState,
      actor: User | null,
      id: string,
      date = at(12),
      decisionId = "decisao-ajustes",
    ) =>
      requestProposalAdjustments(
        s,
        actor,
        id,
        "  Detalhe a prática.  ",
        date,
        decisionId,
      ),
  },
] as const;
test("RF06: fila contém todas e somente as propostas Em análise, com autor e data, em ordem estável", () => {
  const state = createInitialState(),
    queue = pendingProposals(state, demoUsers);
  assert.deepEqual(
    new Set(queue.map((row) => row.activity.id)),
    new Set(
      state.activities
        .filter((a) => a.status === "Em análise")
        .map((a) => a.id),
    ),
  );
  assert.ok(
    queue.every(
      (row) =>
        row.instructor ===
          demoUsers.find((u) => u.id === row.activity.instructorId)?.name &&
        row.activity.submittedAt,
    ),
  );
  assert.deepEqual(
    queue.map((row) => row.activity.submittedAt),
    queue.map((row) => row.activity.submittedAt).sort(),
  );
  assert.deepEqual(
    pendingProposals({ ...state, activities: [] }, demoUsers),
    [],
  );
});
test("RF06: nova submissão entra na fila sem cópia paralela ou mutação da consulta", () => {
  const result = submitted(),
    before = serializeDemoState(result.state);
  assert.ok(
    pendingProposals(result.state, demoUsers).some(
      (row) => row.activity.id === result.activity.id,
    ),
  );
  curationSummary(result.state);
  curationHistory(result.state, demoUsers);
  proposalEvents(result.activity);
  assert.equal(serializeDemoState(result.state), before);
});
for (const op of operations) {
  test(`Curadoria: ${op.name} registra resultado, data e autoria e sai da fila sem alterar inscrições ou outras atividades`, () => {
    const initial = submitted(),
      before = structuredClone(initial.state);
    const result = success(
      op.run(initial.state, demoCurator, initial.activity.id),
    );
    assert.equal(result.activity.status, op.outcome);
    assert.deepEqual(result.activity.decisions.at(-1), {
      id: `decisao-${op.name === "aprovação" ? "aprovacao" : op.name === "rejeição" ? "rejeicao" : "ajustes"}`,
      curatorId: demoCurator.id,
      outcome: op.outcome,
      decidedAt: at(12),
      ...(op.outcome === "Aprovada"
        ? {}
        : {
            reason:
              op.outcome === "Rejeitada"
                ? "Reorganize o escopo."
                : "Detalhe a prática.",
          }),
    });
    assert.equal(result.activity.id, initial.activity.id);
    assert.equal(result.activity.instructorId, demoStudent.id);
    assert.equal(result.activity.capacity, initial.activity.capacity);
    assert.deepEqual(result.state.enrollments, before.enrollments);
    assert.deepEqual(
      result.state.activities.filter((a) => a.id !== initial.activity.id),
      before.activities.filter((a) => a.id !== initial.activity.id),
    );
    assert.equal(result.state.activities.length, before.activities.length);
    assert.equal(
      pendingProposals(result.state, demoUsers).some(
        (row) => row.activity.id === initial.activity.id,
      ),
      false,
    );
    assert.deepEqual(initial.state, before);
  });
  test(`Curadoria: ${op.name} recusa visitante, discentes, ID inexistente e todo estado fora de Em análise`, () => {
    const initial = submitted();
    for (const actor of [null, demoStudent, demoLearner]) {
      const denied = op.run(initial.state, actor, initial.activity.id);
      assert.equal(denied.ok, false);
      assert.equal(denied.state, initial.state);
    }
    assert.equal(op.run(initial.state, demoCurator, "inexistente").ok, false);
    for (const status of [
      "Rascunho",
      "Aprovada",
      "Rejeitada",
      "Ajustes solicitados",
    ] as const) {
      const state = {
        ...initial.state,
        activities: initial.state.activities.map((a) =>
          a.id === initial.activity.id ? { ...a, status } : a,
        ),
      };
      assert.equal(
        op.run(state, demoCurator, initial.activity.id).ok,
        false,
        status,
      );
    }
  });
  test(`Curadoria: ${op.name} impede repetição, data inválida/anterior e identificador repetido`, () => {
    const initial = submitted(),
      result = success(op.run(initial.state, demoCurator, initial.activity.id));
    assert.equal(
      op.run(result.state, demoCurator, initial.activity.id).ok,
      false,
    );
    for (const date of ["inválida", at(10)])
      assert.equal(
        op.run(initial.state, demoCurator, initial.activity.id, date).ok,
        false,
      );
    assert.equal(
      op.run(initial.state, demoCurator, initial.activity.id, at(12), " ").ok,
      false,
    );
    assert.equal(
      op.run(
        initial.state,
        demoCurator,
        initial.activity.id,
        at(12),
        initial.state.activities.flatMap((a) => a.decisions)[0].id,
      ).ok,
      false,
    );
  });
}
test("RF07: aprovação exige campos completos e não cria publicação duplicada", () => {
  const initial = submitted();
  for (const change of [
    { title: " " },
    { syllabus: " " },
    { hours: 0 },
    { capacity: -1 },
    { format: "Inválido" },
    { category: "" },
  ]) {
    const state = {
      ...initial.state,
      activities: initial.state.activities.map((a) =>
        a.id === initial.activity.id ? { ...a, ...change } : a,
      ),
    };
    assert.equal(
      approveProposal(
        state,
        demoCurator,
        initial.activity.id,
        at(12),
        "decisao",
      ).ok,
      false,
    );
  }
  const approved = success(
    approveProposal(
      initial.state,
      demoCurator,
      initial.activity.id,
      at(12),
      "decisao",
    ),
  );
  assert.equal(
    approved.state.activities.filter((a) => a.id === initial.activity.id)
      .length,
    1,
  );
});
for (const kind of ["Rejeitada", "Ajustes solicitados"] as const) {
  test(`RF08/RF09: ${kind} exige texto, conserva estado no erro e aceita texto sem limite mínimo inventado`, () => {
    const initial = submitted();
    const run =
      kind === "Rejeitada" ? rejectProposal : requestProposalAdjustments;
    for (const reason of ["", " ", "\n\t"]) {
      const result = run(
        initial.state,
        demoCurator,
        initial.activity.id,
        reason,
        at(12),
        "decision",
      );
      assert.equal(result.ok, false);
      assert.equal(result.state, initial.state);
    }
    const valid = success(
      run(
        initial.state,
        demoCurator,
        initial.activity.id,
        " A ",
        at(12),
        "decision",
      ),
    );
    assert.equal(valid.activity.decisions.at(-1)?.outcome, kind);
    assert.equal(
      "reason" in valid.activity.decisions[0] &&
        valid.activity.decisions[0].reason,
      "A",
    );
  });
}
test("RF11: somente aprovação habilita busca por título/ementa e combinação de filtros/vagas", () => {
  const initial = submitted();
  for (const op of operations) {
    const result = success(
      op.run(initial.state, demoCurator, initial.activity.id),
    );
    for (const query of ["revisao colaborativa", "argumentos"]) {
      const found = filterActivities(
        result.state.activities,
        result.state.enrollments,
        {
          ...emptyFilters,
          query,
          area: input.thematicArea,
          minHours: "5",
          maxHours: "5",
          format: "Remoto",
          onlyAvailable: true,
        },
      );
      assert.equal(
        found.some((a) => a.id === initial.activity.id),
        op.outcome === "Aprovada",
      );
    }
  }
});
test("RF09/RF10: ajustes, edição, reenvio e aprovação preservam identidade e todos os eventos históricos", () => {
  const initial = submitted();
  const adjusted = success(
    requestProposalAdjustments(
      initial.state,
      demoCurator,
      initial.activity.id,
      "Inclua uma prática orientada.",
      at(12),
      "ajustes-ciclo",
    ),
  );
  assert.equal(
    updateProposal(adjusted.state, demoLearner, initial.activity.id, input).ok,
    false,
  );
  assert.equal(
    updateProposal(adjusted.state, demoStudent, initial.activity.id, {
      ...input,
      title: " ",
    }).ok,
    false,
  );
  const edited = success(
    updateProposal(adjusted.state, demoStudent, initial.activity.id, {
      ...input,
      syllabus: input.syllabus + " Prática orientada em duplas.",
    }),
  );
  assert.equal(edited.activity.status, "Ajustes solicitados");
  assert.deepEqual(edited.activity.decisions, adjusted.activity.decisions);
  const resubmitted = success(
    submitProposal(edited.state, demoStudent, initial.activity.id, at(13)),
  );
  assert.ok(
    pendingProposals(resubmitted.state, demoUsers).some(
      (r) => r.activity.id === initial.activity.id,
    ),
  );
  const approved = success(
    approveProposal(
      resubmitted.state,
      demoCurator,
      initial.activity.id,
      at(14),
      "aprovacao-ciclo",
    ),
  );
  assert.equal(approved.activity.id, initial.activity.id);
  assert.equal(approved.activity.decisions.length, 2);
  assert.equal(
    curationHistory(approved.state, demoUsers, "Ajustes solicitados").filter(
      (r) => r.activity.id === initial.activity.id,
    ).length,
    1,
  );
  assert.equal(
    curationHistory(approved.state, demoUsers, "Aprovada").filter(
      (r) => r.activity.id === initial.activity.id,
    ).length,
    1,
  );
  assert.deepEqual(
    proposalEvents(approved.activity).map((e) => e.title),
    [
      "Proposta criada",
      "Ajustes solicitados",
      "Reenviada para análise",
      "Aprovada",
    ],
  );
  assert.equal(
    updateProposal(approved.state, demoStudent, approved.activity.id, input).ok,
    false,
  );
});
test("Histórico conta decisões anteriores, separadamente dos indicadores de status atual", () => {
  const initial = submitted();
  const adjusted = success(
    requestProposalAdjustments(
      initial.state,
      demoCurator,
      initial.activity.id,
      "Revisar.",
      at(12),
      "a",
    ),
  );
  const resubmitted = success(
    submitProposal(adjusted.state, demoStudent, initial.activity.id, at(13)),
  );
  const summary = curationSummary(resubmitted.state);
  assert.equal(summary.adjustments, curationSummary(initial.state).adjustments);
  assert.equal(
    curationHistory(resubmitted.state, demoUsers, "Ajustes solicitados").length,
    curationHistory(initial.state, demoUsers, "Ajustes solicitados").length + 1,
  );
  const entry = curationHistory(resubmitted.state, demoUsers).find(
    (e) => e.decision.id === "a",
  )!;
  assert.equal(entry.instructor, demoStudent.name);
  assert.equal(entry.curator, demoCurator.name);
  assert.equal(entry.activity.status, "Em análise");
});
test("Persistência v2 preserva decisões e ciclos sem migração desnecessária, inscrições e conclusões intactas", () => {
  const initial = submitted(),
    result = success(
      rejectProposal(
        initial.state,
        demoCurator,
        initial.activity.id,
        "Escopo incompatível.",
        at(12),
        "rejeicao-persistida",
      ),
    );
  const map = new Map<string, string>(),
    storage = {
      getItem: (key: string) => map.get(key) ?? null,
      setItem: (key: string, value: string) => {
        map.set(key, value);
      },
    };
  assert.ok(saveDemoState(storage, result.state));
  const reload = loadDemoState(storage);
  assert.equal(reload.notice, "");
  assert.deepEqual(reload.state, result.state);
  assert.deepEqual(reload.state.enrollments, initial.state.enrollments);
  assert.equal(reload.state.version, 3);
  assert.ok(map.has(demoStorageKey));
  const oldV2 = {
    ...createInitialState(),
    activities: createInitialState().activities.filter(
      (a) => a.id !== "proposta-curadoria-escrita",
    ),
  };
  assert.deepEqual(parseDemoState(serializeDemoState(oldV2)), oldV2);
});
test("Persistência recusa IDs de decisões duplicados e motivos inválidos sem apagar o payload anterior", () => {
  const initial = submitted(),
    result = success(
      rejectProposal(
        initial.state,
        demoCurator,
        initial.activity.id,
        "Revisar.",
        at(12),
        "rejeicao-unica",
      ),
    );
  const broken = structuredClone(result.state),
    a = broken.activities.find((a) => a.id === initial.activity.id)!;
  a.decisions.push({ ...a.decisions[0] });
  assert.equal(parseDemoState(serializeDemoState(broken)), null);
  a.decisions = [
    {
      id: "decision",
      curatorId: demoCurator.id,
      outcome: "Rejeitada",
      decidedAt: at(12),
      reason: " ",
    },
  ];
  assert.equal(parseDemoState(serializeDemoState(broken)), null);
  const raw = serializeDemoState(broken),
    map = new Map([[demoStorageKey, raw]]);
  loadDemoState({
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
  });
  assert.equal(map.get(demoStorageKey), raw);
});
test("Restauração recria fixtures independentes e decisões originais, sem duplicatas", () => {
  const initial = submitted();
  success(
    approveProposal(
      initial.state,
      demoCurator,
      initial.activity.id,
      at(12),
      "decision",
    ),
  );
  const reset = createInitialState();
  assert.equal(
    reset.activities.some((a) => a.id === initial.activity.id),
    false,
  );
  assert.equal(
    new Set(reset.activities.map((a) => a.id)).size,
    reset.activities.length,
  );
  assert.deepEqual(reset, createInitialState());
});
test("Jornada integrada: criação → ajustes → reenvio → aprovação → inscrição → conclusão → horas e PDF próprio", async () => {
  const initial = submitted();
  const adjusted = success(
    requestProposalAdjustments(
      initial.state,
      demoCurator,
      initial.activity.id,
      "Detalhar prática.",
      at(12),
      "ajuste-integrado",
    ),
  );
  const edited = success(
    updateProposal(adjusted.state, demoStudent, initial.activity.id, {
      ...input,
      syllabus: input.syllabus + " Prática em duplas.",
    }),
  );
  const resubmitted = success(
    submitProposal(edited.state, demoStudent, initial.activity.id, at(13)),
  );
  const approved = success(
    approveProposal(
      resubmitted.state,
      demoCurator,
      initial.activity.id,
      at(14),
      "aprovacao-integrada",
    ),
  );
  const enrolled = enrollInActivity(
    approved.state,
    demoLearner,
    initial.activity.id,
    at(15),
    "inscricao-integrada",
  );
  assert.ok(enrolled.ok);
  if (!enrolled.ok) return;
  assert.equal(
    availableSeats(approved.activity, enrolled.state.enrollments),
    input.capacity - 1,
  );
  assert.equal(
    certificateData(
      enrolled.state,
      demoUsers,
      demoLearner,
      enrolled.enrollment.id,
      at(16),
    ),
    null,
  );
  assert.equal(
    confirmEnrollmentCompletion(
      enrolled.state,
      demoCurator,
      enrolled.enrollment.id,
      at(16),
    ).ok,
    false,
  );
  const realized = operateActivity(
    enrolled.state,
    demoStudent,
    initial.activity.id,
    "test-meeting",
    "Realizado",
  );
  const marked = recordAttendance(
    realized.state,
    demoStudent,
    initial.activity.id,
    "test-meeting",
    demoLearner.id,
    true,
    at(16),
  );
  const closed = operateActivity(
    marked.state,
    demoStudent,
    initial.activity.id,
    null,
    "Encerrada",
  );
  const completed = confirmEnrollmentCompletion(
    closed.state,
    demoStudent,
    enrolled.enrollment.id,
    at(16),
  );
  assert.ok(completed.ok);
  if (!completed.ok) return;
  assert.equal(
    participantSummary(completed.state, demoUsers, demoLearner.id).hours,
    input.hours,
  );
  assert.equal(
    availableSeats(approved.activity, completed.state.enrollments),
    input.capacity - 1,
  );
  const snapshot = certificateData(
    completed.state,
    demoUsers,
    demoLearner,
    enrolled.enrollment.id,
    at(17),
  )!;
  assert.equal(snapshot.activityTitle, input.title);
  assert.equal(snapshot.instructorName, demoStudent.name);
  assert.equal(snapshot.participantName, demoLearner.name);
  const bytes = await generateCertificatePdf(
    completed.state,
    demoUsers,
    demoLearner,
    enrolled.enrollment.id,
    { issuedAt: at(17) },
  );
  const pdf = await PDFDocument.load(bytes);
  assert.equal(pdf.getPageCount(), 1);
  assert.ok(pdf.getTitle()?.includes(input.title));
  assert.deepEqual(
    parseDemoState(serializeDemoState(completed.state)),
    completed.state,
  );
  assert.equal(
    createProposal(completed.state, demoCurator, input, at(17), "proibida").ok,
    false,
  );
});

test("RF10: reenvio não pode anteceder a criação ou a decisão anterior", () => {
  const initial = submitted();
  const adjusted = success(
    requestProposalAdjustments(
      initial.state,
      demoCurator,
      initial.activity.id,
      "Revisar.",
      at(12),
      "decisao-temporal",
    ),
  );
  const denied = submitProposal(
    adjusted.state,
    demoStudent,
    initial.activity.id,
    at(11),
  );
  assert.equal(denied.ok, false);
  assert.equal(denied.state, adjusted.state);
  const created = success(
    createProposal(
      createInitialState(),
      demoStudent,
      input,
      at(10),
      "proposta-temporal",
    ),
  );
  assert.equal(
    submitProposal(created.state, demoStudent, created.activity.id, at(9)).ok,
    false,
  );
});
