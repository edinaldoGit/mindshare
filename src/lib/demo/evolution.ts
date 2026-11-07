import type {
  Activity,
  Attendance,
  DemoState,
  Delivery,
  FacultyApplication,
  Lesson,
  User,
  VideoProgress,
} from "../../types/domain.ts";
export const demoLesson: Lesson = {
  id: "bbb-observacao",
  title: "Observação de cena: composição e movimento",
  description:
    "Observe enquadramentos, composição e movimento em um trecho de animação e relacione suas escolhas visuais.",
  src: "media/big-buck-bunny-excerpt.mp4",
  duration: 180,
  required: true,
};
export const emptyDelivery = (): Delivery => ({
  minimum: 75,
  location: "",
  link: "",
  instructions: "",
  meetings: [],
  lessons: [],
  closed: false,
});
export const activeCurators = (state: DemoState) =>
  state.users.filter(
    (u) =>
      u.kind === "Professor Curador" &&
      u.active !== false &&
      u.verified !== false,
  );
export const assignedTo = (
  state: DemoState,
  actor: User | null,
  activity: Activity,
) =>
  !!actor &&
  activeCurators(state).some((u) => u.id === actor.id) &&
  activity.curatorId === actor.id;
export function deliveryError(activity: Pick<Activity, "format" | "delivery">) {
  const d = activity.delivery;
  if (!d) return "Informe a organização da atividade.";
  if (d.link && !safeMeetingLink(d.link))
    return "Informe um link HTTP(S) seguro.";
  if (!Number.isFinite(d.minimum) || d.minimum < 0 || d.minimum > 100)
    return "Informe um percentual entre 0 e 100.";
  if (activity.format === "Remota assíncrona") {
    if (!d.lessons.some((l) => l.required))
      return "Associe pelo menos uma videoaula obrigatória.";
    if (new Set(d.lessons.map((l) => l.id)).size !== d.lessons.length)
      return "Não duplique videoaulas na proposta.";
    if (
      d.lessons.some(
        (l) =>
          l.id !== demoLesson.id ||
          l.src !== demoLesson.src ||
          l.duration !== demoLesson.duration,
      )
    )
      return "Selecione uma videoaula disponível.";
  } else {
    if (activity.format === "Presencial" && !d.location.trim())
      return "Informe o local de realização.";
    if (activity.format === "Remota síncrona" && !safeMeetingLink(d.link))
      return "Informe um link de reunião HTTP(S) válido.";
    if (
      !d.meetings.length ||
      d.meetings.some(
        (m) =>
          !m.id ||
          !Number.isFinite(Date.parse(m.date)) ||
          !Number.isFinite(m.duration) ||
          m.duration <= 0,
      )
    )
      return "Planeje ao menos um encontro com data e duração válidas.";
    if (new Set(d.meetings.map((m) => m.id)).size !== d.meetings.length)
      return "Os encontros precisam ter identificadores únicos.";
  }
  return null;
}
export function safeMeetingLink(value: string) {
  try {
    const u = new URL(value);
    return (
      ["https:", "http:"].includes(u.protocol) &&
      !u.username &&
      !u.password &&
      !!u.hostname
    );
  } catch {
    return false;
  }
}
type Result = { ok: boolean; state: DemoState; message: string; id?: string };
const fail = (state: DemoState, message: string): Result => ({
  ok: false,
  state,
  message,
});
export function requestFaculty(
  state: DemoState,
  input: Pick<FacultyApplication, "name" | "email" | "department" | "method">,
  now: string,
  id: string,
  positive = false,
): Result {
  if (state.applications.some((a) => a.id === id))
    return fail(state, "Identificador de solicitação repetido.");
  if (
    !input.name.trim() ||
    !input.department.trim() ||
    !/^([^\s@]+)@mindshare\.test$/.test(input.email) ||
    !id ||
    !Number.isFinite(Date.parse(now))
  )
    return fail(
      state,
      "Use identificação fictícia completa e e-mail @mindshare.test.",
    );
  if (
    state.users.some((u) => u.email === input.email) ||
    state.applications.some((a) => a.email === input.email)
  )
    return fail(state, "Já existe uma conta ou solicitação com este e-mail.");
  const automatic = input.method === "Institucional simulada";
  const application: FacultyApplication = {
    ...input,
    id,
    createdAt: now,
    evidence:
      "Declaração de vínculo inteiramente fictícia. Nenhum arquivo pessoal foi enviado.",
    status: automatic ? (positive ? "Aprovada" : "Rejeitada") : "Pendente",
    ...(automatic
      ? {
          decidedBy: "fonte-institucional-simulada",
          decidedAt: now,
          reason: positive
            ? "Fonte simulada confirmou identidade e vínculo ativo."
            : "Fonte simulada não confirmou vínculo ativo.",
          ...(positive ? { userId: `docente-${id}` } : {}),
        }
      : {}),
  };
  const user: User = {
    id: `docente-${id}`,
    name: input.name,
    email: input.email,
    kind: "Professor Curador",
    active: true,
    verified: true,
    consentAt: now,
  };
  return {
    ok: true,
    id,
    state: {
      ...state,
      applications: [...state.applications, application],
      users: automatic && positive ? [...state.users, user] : state.users,
    },
    message: automatic
      ? positive
        ? "Consulta demonstrativa concluída: perfil ativado."
        : "Consulta demonstrativa concluída sem confirmação de vínculo."
      : "Solicitação enviada. Aguarde a análise administrativa.",
  };
}
export function decideFaculty(
  state: DemoState,
  actor: User | null,
  id: string,
  approve: boolean,
  reason: string,
  now: string,
): Result {
  const app = state.applications.find((a) => a.id === id);
  if (actor?.kind !== "Administrador" || !app || app.status !== "Pendente")
    return fail(
      state,
      "Somente Administração pode decidir uma solicitação pendente.",
    );
  if (!approve && !reason.trim())
    return fail(state, "Informe o motivo da rejeição.");
  if (!Number.isFinite(Date.parse(now)))
    return fail(state, "Data de decisão inválida.");
  const uid = `docente-${id}`;
  const updated: FacultyApplication = {
    ...app,
    status: approve ? "Aprovada" : "Rejeitada",
    reason: reason.trim() || "Documentação fictícia aprovada.",
    decidedBy: actor.id,
    decidedAt: now,
    ...(approve ? { userId: uid } : {}),
  };
  return {
    ok: true,
    state: {
      ...state,
      applications: state.applications.map((a) => (a.id === id ? updated : a)),
      users: approve
        ? [
            ...state.users,
            {
              id: uid,
              name: app.name,
              email: app.email,
              kind: "Professor Curador",
              active: true,
              verified: true,
              consentAt: now,
            },
          ]
        : state.users,
    },
    message: approve
      ? "Cadastro aprovado. Perfil de Curador ativo."
      : "Solicitação rejeitada com motivo registrado.",
  };
}
export function toggleCurator(
  state: DemoState,
  actor: User | null,
  id: string,
): Result {
  if (
    actor?.kind !== "Administrador" ||
    !state.users.some(
      (u) =>
        u.id === id && u.kind === "Professor Curador" && u.verified !== false,
    )
  )
    return fail(state, "Ação administrativa indisponível.");
  return {
    ok: true,
    state: {
      ...state,
      users: state.users.map((u) =>
        u.id === id && u.kind === "Professor Curador"
          ? { ...u, active: u.active === false }
          : u,
      ),
    },
    message: "Permissão de curadoria atualizada.",
  };
}
export function reassignProposal(
  state: DemoState,
  actor: User | null,
  id: string,
  to: string,
  reason: string,
  now: string,
): Result {
  const a = state.activities.find((a) => a.id === id);
  if (!Number.isFinite(Date.parse(now)))
    return fail(state, "Data de transferência inválida.");
  if (
    actor?.kind !== "Administrador" ||
    !a ||
    !["Em análise", "Ajustes solicitados"].includes(a.status) ||
    !activeCurators(state).some((u) => u.id === to) ||
    a.curatorId === to ||
    !reason.trim()
  )
    return fail(
      state,
      "Selecione proposta pendente, outro Curador ativo e informe o motivo.",
    );
  return {
    ok: true,
    state: {
      ...state,
      activities: state.activities.map((x) =>
        x.id === id
          ? {
              ...x,
              curatorId: to,
              assignments: [
                ...(x.assignments ?? []),
                {
                  from: x.curatorId ?? "",
                  to,
                  adminId: actor.id,
                  at: now,
                  reason: reason.trim(),
                },
              ],
            }
          : x,
      ),
    },
    message: "Proposta transferida. Estado acadêmico preservado.",
  };
}
export function attendanceSummary(
  state: DemoState,
  a: Activity,
  participantId: string,
) {
  const realized =
    a.delivery?.meetings.filter((m) => m.status === "Realizado") ?? [];
  const records = state.attendance.filter(
    (r) =>
      r.activityId === a.id &&
      r.participantId === participantId &&
      realized.some((m) => m.id === r.meetingId),
  );
  const present = records.filter((r) => r.present).length;
  return {
    present,
    count: records.length,
    pending: realized.length - records.length,
    percent: records.length ? (present / records.length) * 100 : null,
    minimum: a.delivery?.minimum ?? 0,
    closed: a.delivery?.closed ?? false,
  };
}
export function recordAttendance(
  state: DemoState,
  actor: User | null,
  activityId: string,
  meetingId: string,
  participantId: string,
  present: boolean,
  now: string,
): Result {
  const a = state.activities.find((a) => a.id === activityId);
  if (
    actor?.kind !== "Discente" ||
    !a ||
    a.instructorId !== actor.id ||
    a.status !== "Aprovada" ||
    a.format === "Remota assíncrona" ||
    !a.delivery?.meetings.some(
      (m) => m.id === meetingId && m.status === "Realizado",
    ) ||
    !state.enrollments.some(
      (e) => e.activityId === a.id && e.participantId === participantId,
    )
  )
    return fail(
      state,
      "Somente o Instrutor responsável registra frequência de inscritos em encontro realizado.",
    );
  if (!Number.isFinite(Date.parse(now)))
    return fail(state, "Data de frequência inválida.");
  const record: Attendance = {
    activityId,
    meetingId,
    participantId,
    present,
    recordedAt: now,
    instructorId: actor.id,
  };
  return {
    ok: true,
    state: {
      ...state,
      attendance: [
        ...state.attendance.filter(
          (r) =>
            !(
              r.activityId === activityId &&
              r.meetingId === meetingId &&
              r.participantId === participantId
            ),
        ),
        record,
      ],
    },
    message: "Frequência salva.",
  };
}
export function operateActivity(
  state: DemoState,
  actor: User | null,
  id: string,
  meetingId: string | null,
  status: "Realizado" | "Cancelado" | "Encerrada",
): Result {
  const a = state.activities.find((x) => x.id === id);
  if (
    actor?.kind !== "Discente" ||
    !a ||
    a.instructorId !== actor.id ||
    a.status !== "Aprovada" ||
    !a.delivery ||
    a.format === "Remota assíncrona"
  )
    return fail(state, "Operação disponível somente ao Instrutor responsável.");
  if (
    status === "Encerrada" &&
    a.delivery.meetings.some((m) => m.status === "Planejado")
  )
    return fail(
      state,
      "Registre a realização ou o cancelamento de todos os encontros antes de encerrar.",
    );
  if (
    status !== "Encerrada" &&
    !a.delivery.meetings.some((m) => m.id === meetingId)
  )
    return fail(state, "Encontro não encontrado.");
  return {
    ok: true,
    state: {
      ...state,
      activities: state.activities.map((x) =>
        x.id === id
          ? {
              ...x,
              delivery: {
                ...a.delivery!,
                closed: status === "Encerrada" ? true : a.delivery!.closed,
                meetings: a.delivery!.meetings.map((m) =>
                  m.id === meetingId
                    ? { ...m, status: status as "Realizado" | "Cancelado" }
                    : m,
                ),
              },
            }
          : x,
      ),
    },
    message:
      status === "Encerrada"
        ? "Atividade encerrada. Confira os critérios de cada participante."
        : "Situação do encontro registrada.",
  };
}
export function mergeIntervals(
  intervals: [number, number][],
  duration: number,
): [number, number][] {
  const sorted = intervals
    .filter(
      ([a, b]) =>
        Number.isFinite(a) &&
        Number.isFinite(b) &&
        a >= 0 &&
        b > a &&
        b <= duration + 0.1,
    )
    .map(([a, b]) => [a, Math.min(duration, b)] as [number, number])
    .sort((a, b) => a[0] - b[0]);
  const result: [number, number][] = [];
  for (const segment of sorted) {
    const last = result.at(-1);
    if (last && segment[0] <= last[1]) last[1] = Math.max(last[1], segment[1]);
    else result.push([...segment]);
  }
  return result;
}
export const validatedSeconds = (intervals: [number, number][]) =>
  intervals.reduce((sum, [a, b]) => sum + b - a, 0);
export function videoSummary(
  state: DemoState,
  a: Activity,
  participantId: string,
) {
  const lessons = a.delivery?.lessons.filter((l) => l.required) ?? [];
  const total = lessons.reduce((s, l) => s + l.duration, 0);
  const seconds = lessons.reduce(
    (sum, l) =>
      sum +
      validatedSeconds(
        state.progress.find(
          (p) =>
            p.activityId === a.id &&
            p.lessonId === l.id &&
            p.participantId === participantId,
        )?.intervals ?? [],
      ),
    0,
  );
  const checks = lessons.every(
    (l) =>
      (state.progress.find(
        (p) =>
          p.activityId === a.id &&
          p.lessonId === l.id &&
          p.participantId === participantId,
      )?.checkpoints.length ?? 0) > 0,
  );
  return {
    percent: total ? Math.min(100, (seconds / total) * 100) : 0,
    seconds,
    total,
    checks,
  };
}
export function saveVideoProgress(
  state: DemoState,
  actor: User | null,
  activityId: string,
  lessonId: string,
  start: number,
  end: number,
  position: number,
  checkpoint?: number,
  tracking?: { watchedSinceCheck: number; pendingCheck: boolean },
): Result {
  const a = state.activities.find((a) => a.id === activityId),
    lesson = a?.delivery?.lessons.find((l) => l.id === lessonId);
  if (
    actor?.kind !== "Discente" ||
    !a ||
    !lesson ||
    a.status !== "Aprovada" ||
    !state.enrollments.some(
      (e) => e.activityId === activityId && e.participantId === actor.id,
    ) ||
    !Number.isFinite(position) ||
    position < 0 ||
    position > lesson.duration + 1
  )
    return fail(
      state,
      "Acompanhamento disponível apenas para Participante inscrito.",
    );
  if (
    end < start ||
    end - start > 3 ||
    start < 0 ||
    end > lesson.duration + 0.1 ||
    !Number.isFinite(start) ||
    !Number.isFinite(end)
  )
    return fail(state, "Intervalo de reprodução inválido.");
  const old = state.progress.find(
    (p) =>
      p.activityId === activityId &&
      p.lessonId === lessonId &&
      p.participantId === actor.id,
  );
  if (
    tracking &&
    (!Number.isFinite(tracking.watchedSinceCheck) ||
      tracking.watchedSinceCheck < 0 ||
      tracking.watchedSinceCheck > lesson.duration + 2 ||
      typeof tracking.pendingCheck !== "boolean")
  )
    return fail(state, "Estado de acompanhamento inválido.");
  if (
    old?.pendingCheck &&
    (end > start ||
      (tracking?.pendingCheck === false && checkpoint === undefined))
  )
    return fail(
      state,
      "Confirme o acompanhamento antes de continuar a reprodução validada.",
    );
  const progress: VideoProgress = {
    activityId,
    lessonId,
    participantId: actor.id,
    position,
    watchedSinceCheck:
      checkpoint !== undefined
        ? 0
        : (tracking?.watchedSinceCheck ??
          old?.watchedSinceCheck ??
          Math.max(
            0,
            validatedSeconds(old?.intervals ?? []) -
              (old?.confirmedSeconds ?? 0),
          )),
    pendingCheck:
      checkpoint !== undefined
        ? false
        : (tracking?.pendingCheck ?? old?.pendingCheck ?? false),
    confirmedSeconds:
      checkpoint !== undefined
        ? validatedSeconds(old?.intervals ?? [])
        : (old?.confirmedSeconds ?? 0),
    intervals: mergeIntervals(
      [
        ...(old?.intervals ?? []),
        ...(end > start ? [[start, end] as [number, number]] : []),
      ],
      lesson.duration,
    ),
    checkpoints: [
      ...new Set([
        ...(old?.checkpoints ?? []),
        ...(checkpoint !== undefined &&
        Number.isFinite(checkpoint) &&
        checkpoint >= 0 &&
        checkpoint <= lesson.duration
          ? [checkpoint]
          : []),
      ]),
    ],
  };
  return {
    ok: true,
    state: {
      ...state,
      progress: [...state.progress.filter((p) => p !== old), progress],
    },
    message: "Progresso salvo.",
  };
}
export function completionEligibility(
  state: DemoState,
  a: Activity,
  participantId: string,
): { eligible: boolean; reason: string } {
  if (a.legacyCompletion || !a.delivery)
    return {
      eligible: true,
      reason:
        "Registro legado sem controle de frequência; compatibilidade preservada.",
    };
  if (a.format === "Remota assíncrona") {
    const p = videoSummary(state, a, participantId);
    return {
      eligible:
        p.percent + 0.01 >= a.delivery.minimum &&
        p.checks &&
        a.delivery.lessons
          .filter((l) => l.required)
          .every(
            (l) =>
              (validatedSeconds(
                state.progress.find(
                  (r) =>
                    r.activityId === a.id &&
                    r.lessonId === l.id &&
                    r.participantId === participantId,
                )?.intervals ?? [],
              ) /
                l.duration) *
                100 +
                0.01 >=
              a.delivery!.minimum,
          ),
      reason: `${p.percent.toFixed(1)}% acompanhado · mínimo ${a.delivery.minimum}% · ${p.checks ? "confirmação registrada" : "confirmação pendente"}`,
    };
  }
  const p = attendanceSummary(state, a, participantId);
  return {
    eligible:
      p.closed &&
      p.pending === 0 &&
      p.count > 0 &&
      (p.percent ?? 0) >= p.minimum,
    reason: `${p.percent === null ? "Sem dados" : p.percent.toFixed(1) + "%"} · mínimo ${p.minimum}% · ${p.pending} lançamento(s) pendente(s) · ${p.closed ? "encerrada" : "cálculo parcial"}`,
  };
}
export function evolutionActivities(base: Activity[]): Activity[] {
  const template =
    base.find(
      (a) => a.instructorId === "discente-demo" && a.status === "Aprovada",
    ) ?? base[0];
  const meeting = (id: string) => ({
    id,
    date: "2026-11-06T14:00:00.000Z",
    duration: 60,
    status: "Planejado" as const,
  });
  return [
    ...base.map((a) => ({
      ...a,
      format: a.format === "Remoto" ? "Remota síncrona" : a.format,
      curatorId: a.curatorId ?? "curador-demo",
      assignments: a.assignments ?? [],
      legacyCompletion: a.delivery ? false : true,
    })),
    {
      ...template,
      id: "oficina-presencial",
      title: "Design colaborativo: ideias no papel",
      summary: "Uma oficina para transformar ideias em protótipos.",
      format: "Presencial",
      hours: 2,
      capacity: 20,
      curatorId: "curador-demo",
      decisions: [],
      delivery: {
        ...emptyDelivery(),
        location: "Laboratório 2 · Campus Quixadá",
        meetings: [
          meeting("design-1"),
          { ...meeting("design-2"), date: "2026-11-07T14:00:00.000Z" },
        ],
      },
      legacyCompletion: false,
    },
    {
      ...template,
      id: "oficina-sincrona",
      title: "Narrativas para compartilhar ciência",
      summary: "Encontro ao vivo para praticar comunicação científica.",
      format: "Remota síncrona",
      hours: 1,
      capacity: 20,
      curatorId: "curador-marcos",
      decisions: [],
      delivery: {
        ...emptyDelivery(),
        link: "https://meet.google.com/abc-defg-hij",
        meetings: [meeting("ciencia-1")],
      },
      legacyCompletion: false,
    },
    {
      ...template,
      id: "animacao-digital",
      title: "Introdução à Animação Digital",
      summary:
        "Observe composição de cenas e técnicas de movimento em uma obra aberta.",
      syllabus:
        "Conceitos básicos de animação digital, composição de cenas, narrativa visual e observação de técnicas de movimento. O trecho de Big Buck Bunny é um recurso de observação: identifique três escolhas de enquadramento e de movimento. Não é, isoladamente, uma aula didática completa.",
      format: "Remota assíncrona",
      hours: 0.5,
      capacity: 30,
      curatorId: "curador-demo",
      decisions: [],
      delivery: {
        ...emptyDelivery(),
        minimum: 90,
        lessons: [demoLesson],
        instructions:
          "Observe as cenas e acompanhe pelo menos 90% do vídeo obrigatório, com confirmação de acompanhamento.",
      },
      legacyCompletion: false,
    },
  ];
}
export function validPlaybackSpan(input: {
  delta: number;
  wall: number;
  rate: number;
  paused: boolean;
  seeking: boolean;
  hidden: boolean;
  blocked: boolean;
  error: boolean;
}) {
  return (
    !input.paused &&
    !input.seeking &&
    !input.hidden &&
    !input.blocked &&
    !input.error &&
    input.delta > 0 &&
    input.delta <= 2 &&
    input.delta <= input.wall * input.rate + 0.35
  );
}

/** Registro operacional atômico; não modifica duração, mínimo ou modalidade aprovados. */
export function saveMeetingAttendance(
  state: DemoState,
  actor: User | null,
  activityId: string,
  meetingId: string,
  input: {
    date: string;
    subject: string;
    records: Record<string, boolean | null>;
  },
  now: string,
): Result {
  const a = state.activities.find((x) => x.id === activityId);
  const meeting = a?.delivery?.meetings.find((m) => m.id === meetingId);
  if (
    actor?.kind !== "Discente" ||
    a?.instructorId !== actor.id ||
    a.status !== "Aprovada" ||
    a.format === "Remota assíncrona" ||
    !meeting ||
    meeting.status === "Cancelado"
  )
    return fail(
      state,
      "Somente o Instrutor responsável pode salvar um encontro ativo desta atividade.",
    );
  if (
    !Number.isFinite(Date.parse(input.date)) ||
    !Number.isFinite(Date.parse(now)) ||
    !input.subject.trim()
  )
    return fail(
      state,
      "Informe data, horário e assunto abordado antes de salvar.",
    );
  const enrollments = state.enrollments.filter(
    (e) => e.activityId === activityId,
  );
  for (const [id, present] of Object.entries(input.records)) {
    const enrollment = enrollments.find((e) => e.participantId === id);
    if (!enrollment || (present !== null && typeof present !== "boolean"))
      return fail(
        state,
        "A frequência só pode ser registrada para participantes inscritos.",
      );
    const old = state.attendance.find(
      (r) =>
        r.activityId === activityId &&
        r.meetingId === meetingId &&
        r.participantId === id,
    );
    if (enrollment.status === "Concluída" && (old?.present ?? null) !== present)
      return fail(
        state,
        "A frequência de uma conclusão confirmada não pode ser alterada.",
      );
  }
  let next = operateActivity(
    state,
    actor,
    activityId,
    meetingId,
    "Realizado",
  ).state;
  next = {
    ...next,
    activities: next.activities.map((x) =>
      x.id === activityId
        ? {
            ...x,
            delivery: {
              ...x.delivery!,
              meetings: x.delivery!.meetings.map((m) =>
                m.id === meetingId
                  ? {
                      ...m,
                      date: input.date,
                      subject: input.subject.trim(),
                      updatedAt: now,
                      updatedBy: actor.id,
                    }
                  : m,
              ),
            },
          }
        : x,
    ),
  };
  for (const [id, present] of Object.entries(input.records)) {
    if (present === null)
      next = {
        ...next,
        attendance: next.attendance.filter(
          (r) =>
            !(
              r.activityId === activityId &&
              r.meetingId === meetingId &&
              r.participantId === id
            ),
        ),
      };
    else {
      const result = recordAttendance(
        next,
        actor,
        activityId,
        meetingId,
        id,
        present,
        now,
      );
      if (!result.ok) return fail(state, result.message);
      next = result.state;
    }
  }
  return {
    ok: true,
    state: next,
    message:
      "Encontro e frequência salvos. O acompanhamento dos participantes foi atualizado.",
  };
}
