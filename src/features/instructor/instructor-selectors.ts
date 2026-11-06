import type { Activity, DemoState, Enrollment, User } from "../../types/domain.ts";
import { availableSeats } from "../catalog/catalog-selectors.ts";

export const instructorActivities = (state: DemoState, instructorId: string) =>
  state.activities.filter((activity) => activity.instructorId === instructorId);
const latestProposalDate = (activity: Activity) =>
  activity.decisions.at(-1)?.decidedAt ?? activity.submittedAt ?? activity.createdAt ?? "";
export const instructorProposals = (state: DemoState, instructorId: string) =>
  instructorActivities(state, instructorId).sort((a, b) =>
    latestProposalDate(b).localeCompare(latestProposalDate(a)),
  );
export const approvedInstructorActivities = (state: DemoState, instructorId: string) =>
  instructorActivities(state, instructorId).filter((activity) => activity.status === "Aprovada");
export const proposalDecision = (activity: Activity) => activity.decisions.at(-1);
export interface ManagedParticipant {
  enrollment: Enrollment;
  participant: User;
}
export function activityParticipants(state: DemoState, users: User[], activityId: string): ManagedParticipant[] {
  return state.enrollments
    .filter((enrollment) => enrollment.activityId === activityId)
    .flatMap((enrollment) => {
      const participant = users.find((user) => user.id === enrollment.participantId);
      return participant?.kind === "Discente" ? [{ enrollment, participant }] : [];
    })
    .sort((a, b) => a.participant.name.localeCompare(b.participant.name, "pt-BR"));
}
export function instructorSummary(state: DemoState, instructorId: string) {
  const proposals = instructorActivities(state, instructorId);
  const activities = approvedInstructorActivities(state, instructorId);
  const participants = activities.reduce((count, activity) => count + state.enrollments.filter((enrollment) => enrollment.activityId === activity.id).length, 0);
  return {
    proposals: proposals.length,
    reviewing: proposals.filter((item) => item.status === "Em análise").length,
    approved: activities.length,
    participants,
  };
}
export { availableSeats };
