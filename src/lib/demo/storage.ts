import { evolutionActivities, safeMeetingLink } from "./evolution.ts";
import type {
  Activity,
  CurationDecision,
  DemoState,
  Enrollment,
} from "../../types/domain.ts";
import { demoUsers, stageFourEnrollments } from "../../data/demo-data.ts";
import { createInitialState, isIsoDate } from "./state.ts";

export const demoStorageKey = "mindshare:demo:data:v3";
export const legacyDemoStorageKey = "mindshare:demo:data:v1";
export interface DemoStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

const statuses = new Set([
  "Rascunho",
  "Em análise",
  "Ajustes solicitados",
  "Aprovada",
  "Rejeitada",
]);
const formats = new Set([
  "Presencial",
  "Remoto",
  "Remota síncrona",
  "Remota assíncrona",
]);
const activityTypes = new Set([
  "Aula",
  "Minicurso",
  "Oficina",
  "Grupo de estudo",
]);
const decisionOutcomes = new Set([
  "Aprovada",
  "Rejeitada",
  "Ajustes solicitados",
]);
const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

export function serializeDemoState(state: DemoState) {
  return JSON.stringify({
    version: 3,
    activities: state.activities,
    enrollments: state.enrollments,
    users: state.users,
    applications: state.applications,
    attendance: state.attendance,
    progress: state.progress,
  });
}

function parseActivity(value: unknown, users = demoUsers): Activity | null {
  if (!isRecord(value)) return null;
  const requiredStrings = [
    "id",
    "instructorId",
    "title",
    "summary",
    "syllabus",
    "format",
    "category",
    "thematicArea",
  ];
  if (
    requiredStrings.some(
      (key) => typeof value[key] !== "string" || !value[key],
    ) ||
    !Number.isFinite(value.hours) ||
    Number(value.hours) <= 0 ||
    !Number.isInteger(value.capacity) ||
    Number(value.capacity) <= 0 ||
    !formats.has(String(value.format)) ||
    !activityTypes.has(String(value.activityType)) ||
    !statuses.has(String(value.status)) ||
    !Array.isArray(value.decisions)
  )
    return null;
  if (
    !users.some(
      (user) => user.id === value.instructorId && user.kind === "Discente",
    )
  )
    return null;
  if (value.createdAt !== undefined && !isIsoDate(value.createdAt)) return null;
  if (value.submittedAt !== undefined && !isIsoDate(value.submittedAt))
    return null;
  const decisions: CurationDecision[] = [];
  for (const raw of value.decisions) {
    if (
      !isRecord(raw) ||
      typeof raw.id !== "string" ||
      !raw.id ||
      !isIsoDate(raw.decidedAt) ||
      !users.some(
        (user) =>
          user.id === raw.curatorId && user.kind === "Professor Curador",
      ) ||
      !decisionOutcomes.has(String(raw.outcome))
    )
      return null;
    if (raw.outcome === "Aprovada")
      decisions.push({
        id: raw.id,
        curatorId: String(raw.curatorId),
        outcome: "Aprovada",
        decidedAt: String(raw.decidedAt),
      });
    else if (typeof raw.reason === "string" && raw.reason.trim())
      decisions.push({
        id: raw.id,
        curatorId: String(raw.curatorId),
        outcome: raw.outcome as "Rejeitada" | "Ajustes solicitados",
        reason: raw.reason,
        decidedAt: String(raw.decidedAt),
      });
    else return null;
  }
  return {
    id: String(value.id),
    instructorId: String(value.instructorId),
    title: String(value.title),
    summary: String(value.summary),
    activityType: value.activityType as Activity["activityType"],
    syllabus: String(value.syllabus),
    hours: Number(value.hours),
    format: String(value.format),
    category: String(value.category),
    thematicArea: String(value.thematicArea),
    capacity: Number(value.capacity),
    status: value.status as Activity["status"],
    ...(value.submittedAt ? { submittedAt: String(value.submittedAt) } : {}),
    ...(value.createdAt ? { createdAt: String(value.createdAt) } : {}),
    decisions,
    ...(typeof value.curatorId === "string"
      ? { curatorId: value.curatorId }
      : {}),
    ...(typeof value.legacyCompletion === "boolean"
      ? { legacyCompletion: value.legacyCompletion }
      : {}),
    ...(Array.isArray(value.assignments)
      ? { assignments: value.assignments as Activity["assignments"] }
      : {}),
    ...(isRecord(value.delivery)
      ? { delivery: value.delivery as unknown as Activity["delivery"] }
      : {}),
  } satisfies Activity;
}

function parseEnrollmentRecords(
  value: unknown,
  activities: Activity[],
  users = demoUsers,
): Enrollment[] | null {
  if (!Array.isArray(value) || value.length > 5000) return null;
  const ids = new Set<string>();
  const pairs = new Set<string>();
  const counts = new Map<string, number>();
  const enrollments: Enrollment[] = [];
  for (const item of value) {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      !item.id ||
      typeof item.activityId !== "string" ||
      typeof item.participantId !== "string" ||
      !isIsoDate(item.enrolledAt) ||
      typeof item.status !== "string"
    )
      return null;
    const activity = activities.find(
      (entry) => entry.id === item.activityId && entry.status === "Aprovada",
    );
    if (
      !activity ||
      !users.some(
        (user) => user.id === item.participantId && user.kind === "Discente",
      ) ||
      ids.has(item.id) ||
      pairs.has(`${item.participantId}:${item.activityId}`)
    )
      return null;
    ids.add(item.id);
    pairs.add(`${item.participantId}:${item.activityId}`);
    const count = (counts.get(activity.id) ?? 0) + 1;
    counts.set(activity.id, count);
    if (count > activity.capacity) return null;
    const base = {
      id: item.id,
      activityId: item.activityId,
      participantId: item.participantId,
      enrolledAt: item.enrolledAt,
    };
    if (item.status === "Inscrito")
      enrollments.push({ ...base, status: "Inscrito" });
    else if (
      item.status === "Concluída" &&
      isIsoDate(item.completedAt) &&
      item.completedAt >= item.enrolledAt
    )
      enrollments.push({
        ...base,
        status: "Concluída",
        completedAt: item.completedAt,
      });
    else return null;
  }
  return enrollments;
}

export function parseDemoState(raw: string): DemoState | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !isRecord(parsed) ||
      (parsed.version !== 2 && parsed.version !== 3) ||
      !Array.isArray(parsed.activities) ||
      parsed.activities.length > 1000
    )
      return null;
    const users = parsed.version === 3 ? parseUsers(parsed.users) : demoUsers;
    if (!users) return null;
    const activities = parsed.activities.map((x) => parseActivity(x, users));
    if (activities.some((item) => !item)) return null;
    const validActivities = activities as Activity[];
    if (
      new Set(validActivities.map((item) => item.id)).size !==
      validActivities.length
    )
      return null;
    const decisionIds = validActivities.flatMap((activity) =>
      activity.decisions.map((decision) => decision.id),
    );
    if (new Set(decisionIds).size !== decisionIds.length) return null;
    const enrollments = parseEnrollmentRecords(
      parsed.enrollments,
      validActivities,
      users,
    );
    if (!enrollments) return null;
    const seed = createInitialState();
    if (parsed.version === 2) {
      const upgraded = evolutionActivities(validActivities).filter(
        (a, i, all) => all.findIndex((item) => item.id === a.id) === i,
      );
      return { ...seed, activities: upgraded, enrollments };
    }
    if (!validExtensions(parsed, validActivities, users, enrollments))
      return null;
    return {
      version: 3,
      activities: validActivities,
      enrollments,
      users,
      applications: parsed.applications as DemoState["applications"],
      attendance: parsed.attendance as DemoState["attendance"],
      progress: parsed.progress as DemoState["progress"],
    };
  } catch {
    return null;
  }
}

function migrateV1(raw: string): DemoState | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !isRecord(parsed) ||
      parsed.version !== 1 ||
      !Array.isArray(parsed.enrollments)
    )
      return null;
    const seed = createInitialState();
    const oldEnrollments = parsed.enrollments as unknown[];
    const additions = stageFourEnrollments.filter(
      (seedEnrollment) =>
        !oldEnrollments.some(
          (item) =>
            isRecord(item) &&
            item.activityId === seedEnrollment.activityId &&
            item.participantId === seedEnrollment.participantId,
        ),
    );
    const enrollments = parseEnrollmentRecords(
      [...oldEnrollments, ...additions],
      seed.activities,
    );
    return enrollments ? { ...seed, enrollments } : null;
  } catch {
    return null;
  }
}

export function loadDemoState(storage: DemoStorage | null): {
  state: DemoState;
  notice: string;
} {
  if (!storage)
    return {
      state: createInitialState(),
      notice:
        "O armazenamento local está indisponível. A demonstração continuará nesta aba.",
    };
  try {
    const current = storage.getItem(demoStorageKey);
    if (current !== null) {
      const state = parseDemoState(current);
      return state
        ? { state, notice: "" }
        : {
            state: createInitialState(),
            notice:
              "Não foi possível recuperar os dados locais. Os exemplos iniciais foram carregados.",
          };
    }
    const v2 = storage.getItem("mindshare:demo:data:v2");
    if (v2 !== null) {
      const upgraded = parseDemoState(v2);
      if (!upgraded)
        return {
          state: createInitialState(),
          notice: "Dados v2 inválidos. O registro original foi preservado.",
        };
      const stored = saveDemoState(storage, upgraded);
      return {
        state: upgraded,
        notice: stored
          ? "Dados migrados de v2 para v3. Propostas, decisões e conclusões legadas preservadas."
          : "Migração disponível em memória; não foi possível salvar v3. O registro v2 foi preservado.",
      };
    }
    const legacy = storage.getItem(legacyDemoStorageKey);
    if (legacy === null) return { state: createInitialState(), notice: "" };
    const migrated = migrateV1(legacy);
    if (!migrated)
      return {
        state: createInitialState(),
        notice:
          "Os dados anteriores não puderam ser migrados; os exemplos iniciais foram carregados. O registro anterior foi mantido.",
      };
    const stored = saveDemoState(storage, migrated);
    return {
      state: migrated,
      notice: stored
        ? "Dados locais atualizados preservando suas inscrições e o histórico."
        : "Migração disponível em memória, preservando inscrições e histórico. Não foi possível salvar v3; o legado foi mantido.",
    };
  } catch {
    return {
      state: createInitialState(),
      notice:
        "Não foi possível ler ou atualizar os dados locais. A demonstração continuará nesta aba.",
    };
  }
}

export function saveDemoState(
  storage: DemoStorage | null,
  state: DemoState,
): boolean {
  try {
    if (!storage) return false;
    storage.setItem(demoStorageKey, serializeDemoState(state));
    return true;
  } catch {
    return false;
  }
}

function parseUsers(value: unknown): DemoState["users"] | null {
  if (!Array.isArray(value) || value.length > 1000) return null;
  if (
    value.some(
      (u) =>
        !isRecord(u) ||
        !["Discente", "Professor Curador", "Administrador"].includes(
          String(u.kind),
        ) ||
        typeof u.id !== "string" ||
        !u.id ||
        typeof u.name !== "string" ||
        !u.name ||
        typeof u.email !== "string" ||
        !u.email.endsWith("@mindshare.test") ||
        !isIsoDate(u.consentAt) ||
        (u.active !== undefined && typeof u.active !== "boolean") ||
        (u.verified !== undefined && typeof u.verified !== "boolean"),
    )
  )
    return null;
  if (
    new Set(value.map((u) => u.id)).size !== value.length ||
    new Set(value.map((u) => u.email)).size !== value.length
  )
    return null;
  return value.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    kind: u.kind,
    consentAt: u.consentAt,
    ...(u.kind === "Professor Curador"
      ? { active: u.active, verified: u.verified }
      : {}),
  })) as DemoState["users"];
}
function validExtensions(
  p: Record<string, unknown>,
  activities: Activity[],
  users: DemoState["users"],
  enrollments: Enrollment[],
) {
  if (
    !Array.isArray(p.applications) ||
    !Array.isArray(p.attendance) ||
    !Array.isArray(p.progress) ||
    [p.applications, p.attendance, p.progress].some((a) => a.length > 5000)
  )
    return false;
  for (const a of activities) {
    if (
      a.curatorId &&
      !users.some((u) => u.id === a.curatorId && u.kind === "Professor Curador")
    )
      return false;
    if (a.delivery) {
      const d = a.delivery;
      if (
        !Number.isFinite(d.minimum) ||
        d.minimum < 0 ||
        d.minimum > 100 ||
        typeof d.location !== "string" ||
        typeof d.link !== "string" ||
        typeof d.instructions !== "string" ||
        typeof d.closed !== "boolean" ||
        (d.link !== "" && !safeMeetingLink(d.link)) ||
        !Array.isArray(d.meetings) ||
        !Array.isArray(d.lessons)
      )
        return false;
      if (
        d.meetings.some(
          (m) =>
            !isRecord(m) ||
            typeof m.id !== "string" ||
            (m.subject !== undefined && typeof m.subject !== "string") ||
            (m.updatedAt !== undefined && !isIsoDate(m.updatedAt)) ||
            (m.updatedBy !== undefined && typeof m.updatedBy !== "string") ||
            !isIsoDate(m.date) ||
            !Number.isFinite(m.duration) ||
            m.duration <= 0 ||
            !["Planejado", "Realizado", "Cancelado"].includes(m.status),
        )
      )
        return false;
      if (new Set(d.meetings.map((m) => m.id)).size !== d.meetings.length)
        return false;
      if (
        d.lessons.some(
          (l) =>
            !isRecord(l) ||
            typeof l.title !== "string" ||
            (l.description !== undefined &&
              typeof l.description !== "string") ||
            l.id !== "bbb-observacao" ||
            l.src !== "media/big-buck-bunny-excerpt.mp4" ||
            l.duration !== 180 ||
            typeof l.required !== "boolean",
        )
      )
        return false;
    }
    if (
      a.assignments &&
      a.assignments.some(
        (r) =>
          !isRecord(r) ||
          !isIsoDate(r.at) ||
          !r.reason ||
          !users.some(
            (u) => u.id === r.adminId && u.kind === "Administrador",
          ) ||
          !users.some((u) => u.id === r.to && u.kind === "Professor Curador"),
      )
    )
      return false;
  }
  const pairs = new Set<string>();
  for (const r of p.attendance) {
    if (
      !isRecord(r) ||
      typeof r.present !== "boolean" ||
      !isIsoDate(r.recordedAt)
    )
      return false;
    const a = activities.find((a) => a.id === r.activityId);
    if (
      !a ||
      a.instructorId !== r.instructorId ||
      !a.delivery?.meetings.some((m) => m.id === r.meetingId) ||
      !enrollments.some(
        (e) => e.activityId === a.id && e.participantId === r.participantId,
      )
    )
      return false;
    const key = `${r.activityId}:${r.meetingId}:${r.participantId}`;
    if (pairs.has(key)) return false;
    pairs.add(key);
  }
  pairs.clear();
  for (const r of p.progress) {
    if (
      !isRecord(r) ||
      !Array.isArray(r.intervals) ||
      !Array.isArray(r.checkpoints)
    )
      return false;
    const a = activities.find((a) => a.id === r.activityId),
      l = a?.delivery?.lessons.find((l) => l.id === r.lessonId);
    if (
      !a ||
      !l ||
      !enrollments.some(
        (e) => e.activityId === a.id && e.participantId === r.participantId,
      ) ||
      !Number.isFinite(r.position) ||
      Number(r.position) < 0 ||
      Number(r.position) > l.duration + 1 ||
      (r.pendingCheck !== undefined && typeof r.pendingCheck !== "boolean") ||
      (r.watchedSinceCheck !== undefined &&
        (!Number.isFinite(r.watchedSinceCheck) ||
          Number(r.watchedSinceCheck) < 0 ||
          Number(r.watchedSinceCheck) > l.duration + 2))
    )
      return false;
    let previous = -1;
    for (const span of r.intervals) {
      if (
        !Array.isArray(span) ||
        span.length !== 2 ||
        !Number.isFinite(span[0]) ||
        !Number.isFinite(span[1]) ||
        span[0] < 0 ||
        span[0] <= previous ||
        span[1] <= span[0] ||
        span[1] > l.duration
      )
        return false;
      previous = span[1];
    }
    if (
      r.confirmedSeconds !== undefined &&
      (!Number.isFinite(r.confirmedSeconds) ||
        Number(r.confirmedSeconds) < 0 ||
        Number(r.confirmedSeconds) > l.duration)
    )
      return false;
    if (
      r.checkpoints.some((x) => !Number.isFinite(x) || x < 0 || x > l.duration)
    )
      return false;
    const key = `${a.id}:${l.id}:${r.participantId}`;
    if (pairs.has(key)) return false;
    pairs.add(key);
  }
  const appIds = new Set<string>();
  for (const r of p.applications) {
    if (
      !isRecord(r) ||
      typeof r.id !== "string" ||
      appIds.has(r.id) ||
      typeof r.name !== "string" ||
      typeof r.email !== "string" ||
      !r.email.endsWith("@mindshare.test") ||
      typeof r.department !== "string" ||
      typeof r.evidence !== "string" ||
      !["Pendente", "Aprovada", "Rejeitada"].includes(String(r.status)) ||
      !["Administrativa", "Institucional simulada"].includes(
        String(r.method),
      ) ||
      !isIsoDate(r.createdAt)
    )
      return false;
    appIds.add(r.id);
    if (
      r.status === "Aprovada" &&
      !users.some((u) => u.id === r.userId && u.kind === "Professor Curador")
    )
      return false;
  }
  return true;
}
