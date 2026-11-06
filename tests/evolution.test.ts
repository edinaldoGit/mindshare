import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createInitialState,
  createProposal,
  submitProposal,
  approveProposal,
  requestProposalAdjustments,
  updateProposal,
  enrollInActivity,
  confirmEnrollmentCompletion,
} from "../src/lib/demo/state.ts";
import {
  activeCurators,
  assignedTo,
  requestFaculty,
  decideFaculty,
  toggleCurator,
  reassignProposal,
  emptyDelivery,
  deliveryError,
  safeMeetingLink,
  recordAttendance,
  operateActivity,
  attendanceSummary,
  saveVideoProgress,
  mergeIntervals,
  validatedSeconds,
  completionEligibility,
  videoSummary,
  validPlaybackSpan,
} from "../src/lib/demo/evolution.ts";
import {
  individualCuration,
  pendingProposals,
  curationHistory,
} from "../src/features/curation/curation-selectors.ts";
import {
  loadDemoState,
  parseDemoState,
  serializeDemoState,
  demoStorageKey,
} from "../src/lib/demo/storage.ts";
import {
  demoStudent as alex,
  demoLearner as julia,
  demoCurator as helena,
} from "../src/data/demo-data.ts";
import {
  canAccessArea,
  authenticateDemo,
} from "../src/features/auth/auth-rules.ts";
import {
  isStudioUrlEnabled,
  loginPrefill,
} from "../src/features/demo-studio/studio-rules.ts";
import type { DemoState } from "../src/types/domain.ts";
const now = "2026-11-05T18:00:00.000Z";
const seed = () => createInitialState();
const admin = seed().users.find((u) => u.kind === "Administrador")!;
const marcos = seed().users.find((u) => u.id === "curador-marcos")!;
const newFaculty = {
  name: "Carolina Teste",
  email: "carolina@mindshare.test",
  department: "Computação",
  method: "Administrativa" as const,
};
function enrolled(id = "oficina-presencial") {
  return enrollInActivity(seed(), julia, id, now, `julia-${id}`).state;
}
function newInput() {
  const a = seed().activities.find((a) => a.id === "oficina-presencial")!;
  return {
    title: a.title,
    syllabus: a.syllabus,
    format: a.format,
    hours: a.hours,
    capacity: a.capacity,
    category: a.category,
    thematicArea: a.thematicArea,
    activityType: a.activityType,
    curatorId: helena.id,
    delivery: a.delivery,
  };
}
function submitted() {
  const r = createProposal(seed(), alex, newInput(), now, "direcionada");
  assert.ok(r.ok);
  return submitProposal(r.state, alex, "direcionada", now).state;
}
function readyAttendance() {
  let s = enrolled();
  const a = s.activities.find((a) => a.id === "oficina-presencial")!;
  for (const m of a.delivery!.meetings) {
    s = operateActivity(s, alex, a.id, m.id, "Realizado").state;
    s = recordAttendance(s, alex, a.id, m.id, julia.id, true, now).state;
  }
  return operateActivity(s, alex, a.id, null, "Encerrada").state;
}
test("Docente: solicitação administrativa persiste pendente sem ativação", () => {
  const r = requestFaculty(seed(), newFaculty, now, "nova");
  assert.ok(r.ok);
  assert.equal(r.state.applications.at(-1)?.status, "Pendente");
  assert.equal(
    r.state.users.some((u) => u.email === newFaculty.email),
    false,
  );
  assert.ok(parseDemoState(serializeDemoState(r.state)));
});
test("Docente: recusa duplicação de e-mail e identificador", () => {
  const s = requestFaculty(seed(), newFaculty, now, "nova").state;
  assert.equal(requestFaculty(s, newFaculty, now, "outra").ok, false);
  assert.equal(
    requestFaculty(
      s,
      { ...newFaculty, email: "outra@mindshare.test" },
      now,
      "nova",
    ).ok,
    false,
  );
});
for (const actor of [null, alex, julia, helena])
  test(`Docente: ${actor?.name ?? "visitante"} não decide solicitação`, () =>
    assert.equal(
      decideFaculty(seed(), actor, "docente-pendente", true, "", now).ok,
      false,
    ));
test("Docente: aprovação habilita login normal e seleção no formulário", () => {
  const r = decideFaculty(seed(), admin, "docente-pendente", true, "", now);
  assert.ok(r.ok);
  const u = authenticateDemo(
    "renata@mindshare.test",
    "demonstracao",
    r.state.users,
  );
  assert.ok(u);
  assert.ok(activeCurators(r.state).some((x) => x.id === u.id));
  assert.ok(parseDemoState(serializeDemoState(r.state)));
  assert.equal(
    decideFaculty(r.state, admin, "docente-pendente", true, "", now).ok,
    false,
  );
});
test("Docente: rejeição exige motivo e não ativa perfil", () => {
  assert.equal(
    decideFaculty(seed(), admin, "docente-pendente", false, "  ", now).ok,
    false,
  );
  const r = decideFaculty(
    seed(),
    admin,
    "docente-pendente",
    false,
    "Vínculo não confirmado",
    now,
  );
  assert.ok(r.ok);
  assert.equal(r.state.applications[0].reason, "Vínculo não confirmado");
  assert.equal(
    authenticateDemo("renata@mindshare.test", "demonstracao", r.state.users),
    null,
  );
});
for (const positive of [false, true])
  test(`Docente: fonte institucional simulada ${positive ? "confirma" : "não confirma"} atributos`, () => {
    const r = requestFaculty(
      seed(),
      { ...newFaculty, method: "Institucional simulada" },
      now,
      "auto",
      positive,
    );
    assert.equal(
      r.state.users.some((u) => u.email === newFaculty.email),
      positive,
    );
    assert.equal(
      r.state.applications.at(-1)?.status,
      positive ? "Aprovada" : "Rejeitada",
    );
  });
test("Curadoria: escolha obrigatória e professor inativo não recebe submissão", () => {
  for (const curatorId of [undefined, "inexistente"]) {
    const r = createProposal(
      seed(),
      alex,
      { ...newInput(), curatorId },
      now,
      "draft",
    );
    assert.equal(submitProposal(r.state, alex, "draft", now).ok, false);
  }
  const s = toggleCurator(submitted(), admin, helena.id).state;
  assert.equal(approveProposal(s, helena, "direcionada", now, "d").ok, false);
  assert.ok(!activeCurators(s).some((u) => u.id === helena.id));
});
test("Curadoria: filas, indicadores e detalhes isolam as atribuições", () => {
  const s = submitted();
  assert.ok(
    pendingProposals(individualCuration(s, helena), s.users).some(
      (e) => e.activity.id === "direcionada",
    ),
  );
  assert.ok(
    !pendingProposals(individualCuration(s, marcos), s.users).some(
      (e) => e.activity.id === "direcionada",
    ),
  );
  assert.equal(
    assignedTo(
      s,
      marcos,
      s.activities.find((a) => a.id === "direcionada")!,
    ),
    false,
  );
});
for (const actor of [alex, marcos, admin, null])
  test(`Curadoria: ${actor?.name ?? "visitante"} não decide proposta atribuída a Helena`, () =>
    assert.equal(
      approveProposal(submitted(), actor, "direcionada", now, "d").ok,
      false,
    ));
test("Curadoria: ajustes e reenvio preservam atribuição e recusa troca unilateral", () => {
  const s = requestProposalAdjustments(
    submitted(),
    helena,
    "direcionada",
    "Detalhe a prática",
    now,
    "ajuste",
  ).state;
  assert.equal(
    updateProposal(s, alex, "direcionada", {
      ...newInput(),
      curatorId: marcos.id,
    }).ok,
    false,
  );
  const updated = updateProposal(s, alex, "direcionada", {
    ...newInput(),
    title: "Título revisto",
  });
  assert.ok(updated.ok);
  const sent = submitProposal(updated.state, alex, "direcionada", now);
  assert.ok(sent.ok);
  if (sent.ok) assert.equal(sent.activity.curatorId, helena.id);
});
test("Curadoria: transferência registra motivo e muda filas sem decisão de mérito", () => {
  const s = reassignProposal(
    submitted(),
    admin,
    "direcionada",
    marcos.id,
    "Indisponibilidade",
    now,
  );
  assert.ok(s.ok);
  const a = s.state.activities.find((a) => a.id === "direcionada")!;
  assert.equal(a.status, "Em análise");
  assert.equal(a.assignments?.at(-1)?.adminId, admin.id);
  assert.equal(approveProposal(s.state, helena, a.id, now, "old").ok, false);
  assert.ok(approveProposal(s.state, marcos, a.id, now, "new").ok);
  assert.equal(
    curationHistory(individualCuration(s.state, helena), s.state.users).some(
      (e) => e.activity.id === a.id,
    ),
    false,
  );
});
for (const actor of [alex, helena, null])
  test(`Reatribuição: ${actor?.name ?? "visitante"} não transfere`, () =>
    assert.equal(
      reassignProposal(
        submitted(),
        actor,
        "direcionada",
        marcos.id,
        "Motivo",
        now,
      ).ok,
      false,
    ));
for (const format of ["Presencial", "Remota síncrona", "Remota assíncrona"])
  test(`Modalidade: ${format} exige organização própria`, () => {
    assert.ok(deliveryError({ format, delivery: emptyDelivery() }));
    const a = seed().activities.find((a) => a.format === format && a.delivery)!;
    assert.equal(deliveryError(a), null);
    for (const minimum of [-1, 101, NaN])
      assert.ok(
        deliveryError({ format, delivery: { ...a.delivery!, minimum } }),
      );
  });
for (const link of [
  "javascript:alert(1)",
  "data:text/html,x",
  "file:///tmp/x",
  "https://user:pass@example.com",
])
  test(`Link de reunião recusa ${link.split(":")[0]}`, () =>
    assert.equal(safeMeetingLink(link), false));
test("Link de reunião aceita HTTP(S) sem credenciais", () => {
  assert.ok(safeMeetingLink("https://example.org/reuniao"));
  assert.ok(safeMeetingLink("http://example.org"));
});
test("Frequência: não registrado permanece distinto de falta", () => {
  let s = enrolled();
  s = operateActivity(
    s,
    alex,
    "oficina-presencial",
    "design-1",
    "Realizado",
  ).state;
  const a = s.activities.find((a) => a.id === "oficina-presencial")!;
  assert.equal(attendanceSummary(s, a, julia.id).percent, null);
  s = recordAttendance(s, alex, a.id, "design-1", julia.id, false, now).state;
  assert.equal(attendanceSummary(s, a, julia.id).percent, 0);
  assert.equal(attendanceSummary(s, a, julia.id).pending, 0);
});
test("Frequência: cálculo parcial e alteração idempotente não duplicam lançamento", () => {
  let s = enrolled();
  for (const id of ["design-1", "design-2"])
    s = operateActivity(s, alex, "oficina-presencial", id, "Realizado").state;
  s = recordAttendance(
    s,
    alex,
    "oficina-presencial",
    "design-1",
    julia.id,
    true,
    now,
  ).state;
  let a = s.activities.find((a) => a.id === "oficina-presencial")!;
  assert.equal(attendanceSummary(s, a, julia.id).percent, 100);
  assert.equal(attendanceSummary(s, a, julia.id).pending, 1);
  assert.equal(completionEligibility(s, a, julia.id).eligible, false);
  s = recordAttendance(s, alex, a.id, "design-2", julia.id, false, now).state;
  s = recordAttendance(s, alex, a.id, "design-2", julia.id, false, now).state;
  a = s.activities.find((x) => x.id === a.id)!;
  assert.equal(s.attendance.length, 2);
  assert.equal(attendanceSummary(s, a, julia.id).percent, 50);
});
for (const actor of [julia, helena, admin, null])
  test(`Frequência: ${actor?.name ?? "visitante"} não lança presença`, () =>
    assert.equal(
      recordAttendance(
        enrolled(),
        actor,
        "oficina-presencial",
        "design-1",
        julia.id,
        true,
        now,
      ).ok,
      false,
    ));
test("Frequência: não inscrito e encontro planejado são recusados", () => {
  assert.equal(
    recordAttendance(
      seed(),
      alex,
      "oficina-presencial",
      "design-1",
      julia.id,
      true,
      now,
    ).ok,
    false,
  );
  assert.equal(
    recordAttendance(
      enrolled(),
      alex,
      "oficina-presencial",
      "design-1",
      julia.id,
      true,
      now,
    ).ok,
    false,
  );
});
test("Conclusão presencial: exige encerramento, lançamentos completos e mínimo", () => {
  const s = readyAttendance(),
    a = s.activities.find((a) => a.id === "oficina-presencial")!;
  assert.ok(completionEligibility(s, a, julia.id).eligible);
  assert.ok(confirmEnrollmentCompletion(s, alex, `julia-${a.id}`, now).ok);
  const missing = { ...s, attendance: [] };
  assert.equal(
    confirmEnrollmentCompletion(missing, alex, `julia-${a.id}`, now).ok,
    false,
  );
  assert.equal(
    operateActivity(enrolled(), alex, a.id, null, "Encerrada").ok,
    false,
  );
});
test("Conclusão síncrona: frequência alimenta o mesmo serviço de histórico", () => {
  let s = enrolled("oficina-sincrona");
  s = operateActivity(
    s,
    alex,
    "oficina-sincrona",
    "ciencia-1",
    "Realizado",
  ).state;
  s = recordAttendance(
    s,
    alex,
    "oficina-sincrona",
    "ciencia-1",
    julia.id,
    true,
    now,
  ).state;
  s = operateActivity(s, alex, "oficina-sincrona", null, "Encerrada").state;
  assert.ok(
    confirmEnrollmentCompletion(s, alex, "julia-oficina-sincrona", now).ok,
  );
});
test("Vídeo: intervalos únicos não contam avanços nem reassistência duplicada", () => {
  const merged = mergeIntervals(
    [
      [0, 3],
      [2, 5],
      [8, 10],
      [0, 2],
    ],
    180,
  );
  assert.deepEqual(merged, [
    [0, 5],
    [8, 10],
  ]);
  assert.equal(validatedSeconds(merged), 7);
  assert.equal(
    validatedSeconds(
      mergeIntervals(
        [
          [0, 1],
          [1.01, 2],
        ],
        180,
      ),
    ),
    1.99,
  );
});
for (const flag of ["paused", "seeking", "hidden", "blocked", "error"] as const)
  test(`Player: ${flag} suspende validação`, () =>
    assert.equal(
      validPlaybackSpan({
        delta: 1,
        wall: 1,
        rate: 1,
        paused: false,
        seeking: false,
        hidden: false,
        blocked: false,
        error: false,
        [flag]: true,
      }),
      false,
    ));
test("Player: avanço e relógio isolado não são progresso", () => {
  assert.equal(
    validPlaybackSpan({
      delta: 40,
      wall: 1,
      rate: 1,
      paused: false,
      seeking: false,
      hidden: false,
      blocked: false,
      error: false,
    }),
    false,
  );
  assert.equal(
    validPlaybackSpan({
      delta: 1,
      wall: 0,
      rate: 1,
      paused: false,
      seeking: false,
      hidden: false,
      blocked: false,
      error: false,
    }),
    false,
  );
  assert.ok(
    validPlaybackSpan({
      delta: 1,
      wall: 1,
      rate: 1,
      paused: false,
      seeking: false,
      hidden: false,
      blocked: false,
      error: false,
    }),
  );
});
test("Vídeo: progresso isolado por participante sobrevive à recarga", () => {
  let s = enrolled("animacao-digital");
  s = saveVideoProgress(
    s,
    julia,
    "animacao-digital",
    "bbb-observacao",
    0,
    2,
    2,
  ).state;
  s = saveVideoProgress(
    s,
    julia,
    "animacao-digital",
    "bbb-observacao",
    0,
    2,
    2,
  ).state;
  assert.equal(validatedSeconds(s.progress[0].intervals), 2);
  assert.equal(s.progress[0].participantId, julia.id);
  assert.deepEqual(parseDemoState(serializeDemoState(s))?.progress, s.progress);
  assert.equal(
    saveVideoProgress(s, alex, "animacao-digital", "bbb-observacao", 2, 3, 3)
      .ok,
    false,
  );
});
test("Vídeo: confirmação registra instante e limite de retomada sem conceder segundos", () => {
  let s = enrolled("animacao-digital");
  s = saveVideoProgress(
    s,
    julia,
    "animacao-digital",
    "bbb-observacao",
    0,
    2,
    2,
  ).state;
  s = saveVideoProgress(
    s,
    julia,
    "animacao-digital",
    "bbb-observacao",
    2,
    2,
    2,
    2,
  ).state;
  assert.equal(validatedSeconds(s.progress[0].intervals), 2);
  assert.equal(s.progress[0].confirmedSeconds, 2);
  assert.deepEqual(s.progress[0].checkpoints, [2]);
});
test("Vídeo: critérios exigem progresso obrigatório e confirmação antes de concluir", () => {
  let s = enrolled("animacao-digital");
  const a = s.activities.find((a) => a.id === "animacao-digital")!;
  assert.equal(
    confirmEnrollmentCompletion(s, alex, "julia-animacao-digital", now).ok,
    false,
  );
  for (let i = 0; i < 164; i += 2)
    s = saveVideoProgress(
      s,
      julia,
      a.id,
      "bbb-observacao",
      i,
      i + 2,
      i + 2,
    ).state;
  assert.equal(completionEligibility(s, a, julia.id).eligible, false);
  s = saveVideoProgress(
    s,
    julia,
    a.id,
    "bbb-observacao",
    164,
    164,
    164,
    164,
  ).state;
  assert.ok(videoSummary(s, a, julia.id).checks);
  assert.ok(completionEligibility(s, a, julia.id).eligible);
  const completed = confirmEnrollmentCompletion(
    s,
    alex,
    "julia-animacao-digital",
    now,
  );
  assert.ok(completed.ok);
  assert.equal(
    confirmEnrollmentCompletion(
      completed.state,
      alex,
      "julia-animacao-digital",
      now,
    ).ok,
    false,
  );
});
test("Vídeo: arquivo local real possui contêiner MP4 e mídia não vazia", () => {
  const bytes = readFileSync(
    new URL("../public/media/big-buck-bunny-excerpt.mp4", import.meta.url),
  );
  assert.equal(bytes.toString("ascii", 4, 8), "ftyp");
  assert.ok(bytes.includes(Buffer.from("moov")));
  assert.ok(bytes.includes(Buffer.from("mdat")));
  assert.ok(bytes.length > 100000 && bytes.length < 20000000);
});
for (const [url, expected] of [
  ["https://exemplo.test/mindshare/#/", false],
  ["https://exemplo.test/mindshare/?demo=1#/", true],
  ["https://exemplo.test/mindshare/#/?demo=1", false],
] as const)
  test(`Studio: ativação explícita ${url}`, () =>
    assert.equal(isStudioUrlEnabled(url), expected));
test("Studio: preenche somente conta fictícia e mantém login normal", () => {
  assert.equal(
    loginPrefill(
      "https://site.test/?demo=1",
      "conta=julia%40mindshare.test",
      seed().users,
    ),
    julia.email,
  );
  assert.equal(
    loginPrefill(
      "https://site.test/",
      "conta=julia%40mindshare.test",
      seed().users,
    ),
    "",
  );
  assert.equal(
    loginPrefill(
      "https://site.test/?demo=1",
      "conta=intruso%40mindshare.test",
      seed().users,
    ),
    "",
  );
  assert.equal(
    authenticateDemo(julia.email, "senha-errada", seed().users),
    null,
  );
});
test("Perfis: Administrador não obtém curadoria ou funcionalidades de Discente", () => {
  assert.ok(canAccessArea(admin, "administration"));
  for (const area of ["curation", "instructor", "participant"] as const)
    assert.equal(canAccessArea(admin, area), false);
});
test("Migração v2→v3 preserva conclusões e decisões, acrescentando cenários sem duplicação", () => {
  const s = seed();
  const v2 = JSON.stringify({
    version: 2,
    activities: s.activities
      .filter((a) => !a.delivery)
      .map((a) => {
        const copy = { ...a };
        delete copy.curatorId;
        delete copy.assignments;
        delete copy.legacyCompletion;
        return copy;
      }),
    enrollments: s.enrollments,
  });
  const map = new Map([["mindshare:demo:data:v2", v2]]);
  const storage = {
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  };
  const loaded = loadDemoState(storage);
  assert.equal(loaded.state.version, 3);
  assert.deepEqual(loaded.state.enrollments, s.enrollments);
  assert.ok(loaded.state.activities.some((a) => a.id === "animacao-digital"));
  assert.equal(
    new Set(loaded.state.activities.map((a) => a.id)).size,
    loaded.state.activities.length,
  );
  assert.equal(map.get("mindshare:demo:data:v2"), v2);
  assert.ok(map.has(demoStorageKey));
  assert.deepEqual(loadDemoState(storage).state, loaded.state);
});
test("Persistência v3 recusa presença órfã, progresso sobreposto e Curador inexistente", () => {
  for (const corrupt of [
    (s: DemoState) => {
      s.attendance = [
        {
          activityId: "inexistente",
          meetingId: "m",
          participantId: julia.id,
          present: true,
          recordedAt: now,
          instructorId: alex.id,
        },
      ];
    },
    (s: DemoState) => {
      s.activities[0].curatorId = "intruso";
    },
    (s: DemoState) => {
      s.progress = [
        {
          activityId: "animacao-digital",
          lessonId: "bbb-observacao",
          participantId: julia.id,
          position: 4,
          checkpoints: [],
          intervals: [
            [0, 3],
            [2, 4],
          ],
        },
      ];
    },
  ]) {
    const s = enrolled("animacao-digital");
    corrupt(s);
    assert.equal(parseDemoState(serializeDemoState(s)), null);
  }
});

// Schema e quota: regressões do caminho de migração, sem apagar o legado.
test("Migração preserva estado recuperado em memória quando a gravação v3 falha", () => {
  const s = createInitialState();
  const raw = JSON.stringify({
    version: 2,
    activities: s.activities,
    enrollments: s.enrollments,
  });
  const storage = {
    getItem: (key: string) => (key === "mindshare:demo:data:v2" ? raw : null),
    setItem: () => {
      throw new Error("quota");
    },
  };
  const loaded = loadDemoState(storage);
  assert.match(loaded.notice, /memória/);
  assert.deepEqual(loaded.state.enrollments, s.enrollments);
  assert.equal(
    new Set(loaded.state.activities.map((a) => a.id)).size,
    loaded.state.activities.length,
  );
  assert.equal(
    parseDemoState(
      serializeDemoState(s).replace('"version":3', '"version":"3"'),
    ),
    null,
  );
});
