import type {
  Activity,
  CurationDecision,
  DemoState,
  User,
} from "../../types/domain.ts";
export type CurationEntry = { activity: Activity; instructor: string };
export type DecisionEntry = CurationEntry & {
  decision: CurationDecision;
  curator: string;
};
const nameFor = (users: User[], id: string) =>
  users.find((user) => user.id === id)?.name ?? "Perfil demonstrativo";
export function pendingProposals(
  state: DemoState,
  users: User[],
): CurationEntry[] {
  return state.activities
    .filter((item) => item.status === "Em análise")
    .slice()
    .sort(
      (a, b) =>
        (a.submittedAt ?? "").localeCompare(b.submittedAt ?? "") ||
        a.id.localeCompare(b.id),
    )
    .map((activity) => ({
      activity,
      instructor: nameFor(users, activity.instructorId),
    }));
}
export function curationSummary(state: DemoState) {
  const count = (status: Activity["status"]) =>
    state.activities.filter((item) => item.status === status).length;
  return {
    pending: count("Em análise"),
    approved: count("Aprovada"),
    adjustments: count("Ajustes solicitados"),
    rejected: count("Rejeitada"),
  };
}
export function curationHistory(
  state: DemoState,
  users: User[],
  outcome?: CurationDecision["outcome"],
): DecisionEntry[] {
  return state.activities
    .flatMap((activity) =>
      activity.decisions
        .filter((decision) => !outcome || decision.outcome === outcome)
        .map((decision) => ({
          activity,
          decision,
          instructor: nameFor(users, activity.instructorId),
          curator: nameFor(users, decision.curatorId),
        })),
    )
    .sort(
      (a, b) =>
        b.decision.decidedAt.localeCompare(a.decision.decidedAt) ||
        a.decision.id.localeCompare(b.decision.id),
    );
}
export function proposalEvents(activity: Activity) {
  const events: {
    id: string;
    date: string;
    title: string;
    reason?: string;
    curatorId?: string;
  }[] = [];
  if (activity.createdAt)
    events.push({
      id: `created-${activity.id}`,
      date: activity.createdAt,
      title: "Proposta criada",
    });
  for (const decision of activity.decisions)
    events.push({
      id: decision.id,
      date: decision.decidedAt,
      title: decision.outcome,
      curatorId: decision.curatorId,
      ...("reason" in decision ? { reason: decision.reason } : {}),
    });
  if (activity.submittedAt)
    events.push({
      id: `submitted-${activity.id}`,
      date: activity.submittedAt,
      title: activity.decisions.some(
        (item) => item.decidedAt < activity.submittedAt!,
      )
        ? "Reenviada para análise"
        : "Enviada para análise",
    });
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export function individualCuration(
  state: DemoState,
  user: User | null,
): DemoState {
  return {
    ...state,
    activities: state.activities.filter(
      (a) =>
        a.curatorId === user?.id &&
        user?.kind === "Professor Curador" &&
        user.active !== false &&
        user.verified !== false,
    ),
  };
}
