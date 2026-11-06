import type {
  Activity,
  DemoState,
  Enrollment,
  User,
} from "../../types/domain.ts";
import { publishedActivities } from "../catalog/catalog-selectors.ts";
export type ParticipantActivity = {
  enrollment: Enrollment;
  activity: Activity;
  instructor: User;
};
export function participantActivities(
  state: DemoState,
  users: User[],
  userId: string,
): ParticipantActivity[] {
  return state.enrollments
    .filter((item) => item.participantId === userId)
    .flatMap((enrollment) => {
      const activity = state.activities.find(
        (item) => item.id === enrollment.activityId,
      );
      const instructor = users.find(
        (item) => item.id === activity?.instructorId,
      );
      return activity && instructor
        ? [{ enrollment, activity, instructor }]
        : [];
    })
    .sort(
      (a, b) =>
        b.enrollment.enrolledAt.localeCompare(a.enrollment.enrolledAt) ||
        a.activity.title.localeCompare(b.activity.title, "pt-BR"),
    );
}
export function completedActivities(
  state: DemoState,
  users: User[],
  userId: string,
) {
  return participantActivities(state, users, userId)
    .filter((item) => item.enrollment.status === "Concluída")
    .sort((a, b) =>
      (b.enrollment.completedAt ?? "").localeCompare(
        a.enrollment.completedAt ?? "",
      ),
    );
}
export function participantSummary(
  state: DemoState,
  users: User[],
  userId: string,
) {
  const all = participantActivities(state, users, userId);
  const completed = completedActivities(state, users, userId);
  return {
    enrollments: all.length,
    completed: completed.length,
    hours: completed.reduce((sum, item) => sum + item.activity.hours, 0),
    certificates: completed.length,
  };
}
export function recommendActivities(
  state: DemoState,
  userId: string,
  area: string,
  maxHours: number,
  excludeEnrolled = true,
) {
  if (!area || !Number.isFinite(maxHours) || maxHours <= 0) return [];
  const enrolled = new Set(
    state.enrollments
      .filter((item) => item.participantId === userId)
      .map((item) => item.activityId),
  );
  return publishedActivities(state.activities).filter(
    (activity) =>
      activity.thematicArea === area &&
      activity.hours <= maxHours &&
      (!excludeEnrolled || !enrolled.has(activity.id)),
  );
}
