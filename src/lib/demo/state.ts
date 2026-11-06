import {
  activeCurators,
  assignedTo,
  completionEligibility,
  deliveryError,
  evolutionActivities,
} from "./evolution.ts";
import { demoUsers } from "../../data/demo-data.ts";
import type { DemoState, Enrollment, User } from "../../types/domain.ts";
import {
  demoActivities,
  demoEnrollments,
  demoStudent,
  stageFourActivities,
  stageFourEnrollments,
  stageFiveActivities,
} from "../../data/demo-data.ts";
import { availableSeats } from "../../features/catalog/catalog-selectors.ts";
import { isPublished } from "../policies.ts";

export function createInitialState(): DemoState {
  const enrollments: Enrollment[] = structuredClone(demoEnrollments).map(
    (enrollment) => {
      if (enrollment.id === "inscricao-python-primeiros-passos-0")
        return { ...enrollment, participantId: demoStudent.id };
      if (enrollment.id === "inscricao-comunicacao-cientifica-0")
        return {
          ...enrollment,
          participantId: demoStudent.id,
          status: "Concluída",
          completedAt: "2026-11-03T15:00:00.000Z",
        };
      if (enrollment.id === "inscricao-web-acessivel-0")
        return {
          ...enrollment,
          participantId: demoStudent.id,
          status: "Concluída",
          completedAt: "2026-11-04T15:00:00.000Z",
        };
      return enrollment;
    },
  );
  return {
    version: 3,
    users: structuredClone(demoUsers),
    applications: [
      {
        id: "docente-pendente",
        name: "Renata Barros",
        email: "renata@mindshare.test",
        department: "Computação · UFC Quixadá",
        method: "Administrativa",
        evidence:
          "Declaração fictícia de vínculo docente. Sem documento pessoal real.",
        status: "Pendente",
        createdAt: "2026-11-04T12:00:00.000Z",
      },
    ],
    attendance: [],
    progress: [],
    activities: evolutionActivities([
      ...structuredClone(demoActivities),
      ...structuredClone(stageFourActivities),
      ...structuredClone(stageFiveActivities),
    ]),
    enrollments: [...enrollments, ...structuredClone(stageFourEnrollments)],
  };
}
export type CommandResult =
  | { ok: true; state: DemoState; enrollment: Enrollment; message: string }
  | { ok: false; state: DemoState; message: string };
export function enrollInActivity(
  state: DemoState,
  actor: User | null,
  activityId: string,
  enrolledAt: string,
  id: string,
): CommandResult {
  const reject = (message: string): CommandResult => ({
    ok: false,
    state,
    message,
  });
  if (actor?.kind !== "Discente")
    return reject(
      "A inscrição está disponível apenas para discentes na demonstração.",
    );
  const activity = state.activities.find((item) => item.id === activityId);
  if (!activity || !isPublished(activity))
    return reject("Esta atividade não está disponível para inscrição.");
  if (
    state.enrollments.some(
      (item) =>
        item.activityId === activityId && item.participantId === actor.id,
    )
  )
    return reject("Você já está inscrito nesta atividade.");
  if (availableSeats(activity, state.enrollments) <= 0)
    return reject(
      "As vagas desta atividade se esgotaram. Explore outras possibilidades no catálogo.",
    );
  if (
    !id ||
    state.enrollments.some((item) => item.id === id) ||
    !isIsoDate(enrolledAt)
  )
    return reject("Não foi possível registrar a inscrição. Tente novamente.");
  const enrollment: Enrollment = {
    id,
    activityId,
    participantId: actor.id,
    enrolledAt,
    status: "Inscrito",
  };
  return {
    ok: true,
    state: { ...state, enrollments: [...state.enrollments, enrollment] },
    enrollment,
    message:
      "Inscrição confirmada na demonstração. A atividade já está no seu espaço.",
  };
}
export function isIsoDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString() === value
  );
}
// Comando único de conclusão, disponível somente ao Discente responsável.
export function confirmEnrollmentCompletion(
  state: DemoState,
  actor: User | null,
  enrollmentId: string,
  completedAt: string,
): CommandResult {
  const reject = (message: string): CommandResult => ({
    ok: false,
    state,
    message,
  });
  const enrollment = state.enrollments.find((item) => item.id === enrollmentId);
  const activity = state.activities.find(
    (item) => item.id === enrollment?.activityId,
  );
  if (
    !enrollment ||
    !activity ||
    actor?.kind !== "Discente" ||
    activity.instructorId !== actor.id ||
    activity.status !== "Aprovada" ||
    enrollment.participantId === actor.id
  )
    return reject(
      "Somente o instrutor responsável pode confirmar a conclusão de uma inscrição existente.",
    );
  if (enrollment.status === "Concluída")
    return reject("A conclusão desta inscrição já foi registrada.");
  if (!isIsoDate(completedAt) || completedAt < enrollment.enrolledAt)
    return reject(
      "A data de conclusão precisa ser válida e posterior à inscrição.",
    );
  const eligibility = completionEligibility(
    state,
    activity,
    enrollment.participantId,
  );
  if (!eligibility.eligible)
    return reject(`Critérios de conclusão pendentes. ${eligibility.reason}`);
  const completed: Enrollment = {
    ...enrollment,
    status: "Concluída",
    completedAt,
  };
  return {
    ok: true,
    enrollment: completed,
    state: {
      ...state,
      enrollments: state.enrollments.map((item) =>
        item.id === enrollmentId ? completed : item,
      ),
    },
    message: "Conclusão registrada na demonstração.",
  };
}

export type ProposalInput = Pick<
  import("../../types/domain.ts").Activity,
  | "title"
  | "syllabus"
  | "hours"
  | "format"
  | "category"
  | "capacity"
  | "thematicArea"
  | "activityType"
> &
  Pick<import("../../types/domain.ts").Activity, "curatorId" | "delivery">;
export type ProposalCommandResult =
  | {
      ok: true;
      state: DemoState;
      activity: import("../../types/domain.ts").Activity;
      message: string;
    }
  | { ok: false; state: DemoState; message: string };

const allowedFormats = new Set([
  "Presencial",
  "Remoto",
  "Remota síncrona",
  "Remota assíncrona",
]);
const allowedTypes = new Set([
  "Aula",
  "Minicurso",
  "Oficina",
  "Grupo de estudo",
]);
const allowedCategories = new Set(
  [...demoActivities, ...stageFourActivities].map(
    (activity) => activity.category,
  ),
);
const allowedAreas = new Set(
  [...demoActivities, ...stageFourActivities].map(
    (activity) => activity.thematicArea,
  ),
);
export function validateProposalInput(input: ProposalInput): string | null {
  if (!input.title.trim()) return "Informe o título da atividade.";
  if (!input.syllabus.trim()) return "Informe a ementa da atividade.";
  if (!Number.isFinite(input.hours) || input.hours <= 0)
    return "Informe uma carga horária positiva.";
  if (!Number.isInteger(input.capacity) || input.capacity <= 0)
    return "Informe um número inteiro de vagas maior que zero.";
  if (!allowedFormats.has(input.format))
    return "Selecione um formato disponível.";
  if (!allowedTypes.has(input.activityType))
    return "Selecione um tipo de atividade disponível.";
  if (!allowedCategories.has(input.category))
    return "Selecione uma categoria disponível.";
  if (!allowedAreas.has(input.thematicArea))
    return "Selecione uma área temática disponível.";
  return null;
}

export function proposalInputErrors(
  input: ProposalInput,
): Partial<Record<keyof ProposalInput, string>> {
  const errors: Partial<Record<keyof ProposalInput, string>> = {};
  if (!input.title.trim()) errors.title = "Informe o título da atividade.";
  if (!input.syllabus.trim())
    errors.syllabus = "Informe a ementa da atividade.";
  if (!Number.isFinite(input.hours) || input.hours <= 0)
    errors.hours = "Informe uma carga horária positiva.";
  if (!Number.isInteger(input.capacity) || input.capacity <= 0)
    errors.capacity = "Informe um número inteiro de vagas maior que zero.";
  if (!allowedFormats.has(input.format))
    errors.format = "Selecione um formato disponível.";
  if (!allowedTypes.has(input.activityType))
    errors.activityType = "Selecione um tipo de atividade disponível.";
  if (!allowedCategories.has(input.category))
    errors.category = "Selecione uma categoria disponível.";
  if (!allowedAreas.has(input.thematicArea))
    errors.thematicArea = "Selecione uma área temática disponível.";
  return errors;
}

export function createProposal(
  state: DemoState,
  actor: User | null,
  input: ProposalInput,
  createdAt: string,
  id: string,
): ProposalCommandResult {
  if (actor?.kind !== "Discente")
    return {
      ok: false,
      state,
      message: "Apenas um Discente pode criar propostas na demonstração.",
    };
  const error =
    validateProposalInput(input) ??
    (input.delivery ? deliveryError(input) : null);
  if (
    error ||
    !isIsoDate(createdAt) ||
    !id ||
    state.activities.some((item) => item.id === id)
  )
    return {
      ok: false,
      state,
      message: error ?? "Não foi possível criar a proposta.",
    };
  const normalized = {
    ...input,
    title: input.title.trim(),
    syllabus: input.syllabus.trim(),
    category: input.category.trim(),
    thematicArea: input.thematicArea.trim(),
  };
  const activity = {
    ...normalized,
    id,
    instructorId: actor.id,
    summary: normalized.syllabus.slice(0, 180),
    status: "Rascunho" as const,
    createdAt,
    decisions: [],
  };
  return {
    ok: true,
    state: { ...state, activities: [...state.activities, activity] },
    activity,
    message: "Proposta salva como rascunho.",
  };
}

export function submitProposal(
  state: DemoState,
  actor: User | null,
  proposalId: string,
  submittedAt: string,
): ProposalCommandResult {
  if (actor?.kind !== "Discente")
    return {
      ok: false,
      state,
      message: "Apenas um Discente pode submeter propostas.",
    };
  const activity = state.activities.find((item) => item.id === proposalId);
  if (!activity || activity.instructorId !== actor.id)
    return { ok: false, state, message: "Esta proposta não pertence a você." };
  if (
    activity.status !== "Rascunho" &&
    activity.status !== "Ajustes solicitados"
  )
    return {
      ok: false,
      state,
      message: "Esta proposta não pode ser submetida neste estado.",
    };
  if (!activeCurators(state).some((u) => u.id === activity.curatorId))
    return {
      ok: false,
      state,
      message: "Selecione um Professor Curador ativo antes de submeter.",
    };
  const organizationError = activity.legacyCompletion
    ? null
    : deliveryError(activity);
  if (organizationError)
    return { ok: false, state, message: organizationError };
  const inputError = validateProposalInput(activity);
  if (inputError || !isIsoDate(submittedAt))
    return {
      ok: false,
      state,
      message: inputError ?? "A data de submissão é inválida.",
    };
  if (
    (activity.createdAt && submittedAt < activity.createdAt) ||
    activity.decisions.some((decision) => submittedAt < decision.decidedAt)
  )
    return {
      ok: false,
      state,
      message:
        "A nova submissão precisa ocorrer após os registros anteriores da proposta.",
    };
  const updated = { ...activity, status: "Em análise" as const, submittedAt };
  const next = {
    ...state,
    activities: state.activities.map((item) =>
      item.id === proposalId ? updated : item,
    ),
  };
  return {
    ok: true,
    state: next,
    activity: updated,
    message: "Proposta enviada para análise da curadoria.",
  };
}

export function updateProposal(
  state: DemoState,
  actor: User | null,
  proposalId: string,
  input: ProposalInput,
): ProposalCommandResult {
  if (actor?.kind !== "Discente")
    return {
      ok: false,
      state,
      message: "Apenas um Discente pode editar propostas.",
    };
  const activity = state.activities.find((item) => item.id === proposalId);
  if (!activity || activity.instructorId !== actor.id)
    return { ok: false, state, message: "Esta proposta não pertence a você." };
  if (activity.status !== "Ajustes solicitados")
    return {
      ok: false,
      state,
      message:
        "A edição só está disponível quando a curadoria solicita ajustes.",
    };
  const error =
    validateProposalInput(input) ??
    (input.delivery ? deliveryError(input) : null);
  if (error) return { ok: false, state, message: error };
  const normalized = {
    ...input,
    title: input.title.trim(),
    syllabus: input.syllabus.trim(),
    category: input.category.trim(),
    thematicArea: input.thematicArea.trim(),
  };
  if (
    activity.submittedAt &&
    input.curatorId &&
    input.curatorId !== activity.curatorId
  )
    return {
      ok: false,
      state,
      message:
        "Somente a Administração pode reatribuir uma proposta submetida.",
    };
  const updated = {
    ...activity,
    ...normalized,
    curatorId: activity.submittedAt ? activity.curatorId : input.curatorId,
    legacyCompletion: input.delivery ? false : activity.legacyCompletion,
    summary: normalized.syllabus.slice(0, 180),
  };
  return {
    ok: true,
    state: {
      ...state,
      activities: state.activities.map((item) =>
        item.id === proposalId ? updated : item,
      ),
    },
    activity: updated,
    message: "Ajustes salvos. A justificativa da curadoria foi preservada.",
  };
}

// Uma única transição de decisão; a aprovação existente continua como API pública.
function decideProposal(
  state: DemoState,
  actor: User | null,
  proposalId: string,
  decidedAt: string,
  decisionId: string,
  outcome: import("../../types/domain.ts").CurationDecision["outcome"],
  reason = "",
): ProposalCommandResult {
  const reject = (message: string): ProposalCommandResult => ({
    ok: false,
    state,
    message,
  });
  if (actor?.kind !== "Professor Curador")
    return reject(
      "Somente o Professor Curador pode registrar decisões de curadoria.",
    );
  const activity = state.activities.find((item) => item.id === proposalId);
  if (!activity || activity.status !== "Em análise")
    return reject("Somente propostas em análise podem receber uma decisão.");
  if (!assignedTo(state, actor, activity))
    return reject("Esta proposta não foi atribuída ao seu perfil ativo.");
  if (outcome !== "Aprovada" && !reason.trim())
    return reject(
      outcome === "Rejeitada"
        ? "Informe a justificativa da rejeição."
        : "Descreva os ajustes necessários.",
    );
  if (outcome === "Aprovada") {
    const error =
      validateProposalInput(activity) ??
      (activity.legacyCompletion ? null : deliveryError(activity));
    if (error)
      return reject(
        `A proposta precisa estar completa para aprovação. ${error}`,
      );
  }
  const lastDecision = activity.decisions.at(-1);
  if (
    !isIsoDate(decidedAt) ||
    !decisionId.trim() ||
    !activity.submittedAt ||
    decidedAt < activity.submittedAt ||
    (lastDecision && decidedAt < lastDecision.decidedAt) ||
    state.activities.some((item) =>
      item.decisions.some((decision) => decision.id === decisionId),
    )
  )
    return reject(
      "Não foi possível registrar a decisão. Verifique a data e o identificador.",
    );
  const decision: import("../../types/domain.ts").CurationDecision =
    outcome === "Aprovada"
      ? { id: decisionId, curatorId: actor.id, outcome, decidedAt }
      : {
          id: decisionId,
          curatorId: actor.id,
          outcome,
          decidedAt,
          reason: reason.trim(),
        };
  const updated = {
    ...activity,
    status: outcome,
    decisions: [...activity.decisions, decision],
  };
  const messages = {
    Aprovada: "Proposta aprovada. A atividade já está disponível no catálogo.",
    Rejeitada:
      "Rejeição registrada. A justificativa está disponível ao Instrutor.",
    "Ajustes solicitados":
      "Ajustes solicitados. O Instrutor já pode consultar o feedback e editar a proposta.",
  };
  return {
    ok: true,
    state: {
      ...state,
      activities: state.activities.map((item) =>
        item.id === proposalId ? updated : item,
      ),
    },
    activity: updated,
    message: messages[outcome],
  };
}

export function approveProposal(
  state: DemoState,
  actor: User | null,
  proposalId: string,
  decidedAt: string,
  decisionId: string,
): ProposalCommandResult {
  return decideProposal(
    state,
    actor,
    proposalId,
    decidedAt,
    decisionId,
    "Aprovada",
  );
}
export function rejectProposal(
  state: DemoState,
  actor: User | null,
  proposalId: string,
  reason: string,
  decidedAt: string,
  decisionId: string,
): ProposalCommandResult {
  return decideProposal(
    state,
    actor,
    proposalId,
    decidedAt,
    decisionId,
    "Rejeitada",
    reason,
  );
}
export function requestProposalAdjustments(
  state: DemoState,
  actor: User | null,
  proposalId: string,
  reason: string,
  decidedAt: string,
  decisionId: string,
): ProposalCommandResult {
  return decideProposal(
    state,
    actor,
    proposalId,
    decidedAt,
    decisionId,
    "Ajustes solicitados",
    reason,
  );
}
