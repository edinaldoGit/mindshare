import type {
  CertificateSnapshot,
  DemoState,
  User,
} from "../../types/domain.ts";
export const certificateLabel =
  "Comprovante demonstrativo | Protótipo MindShare";
export const certificateDisclaimer =
  "A emissão deste comprovante não garante o reconhecimento da carga horária pela UFC.";
export function certificateData(
  state: DemoState,
  users: User[],
  actor: User | null,
  enrollmentId: string,
  issuedAt: string,
): CertificateSnapshot | null {
  if (actor?.kind !== "Discente") return null;
  const enrollment = state.enrollments.find(
    (item) =>
      item.id === enrollmentId &&
      item.participantId === actor.id &&
      item.status === "Concluída",
  );
  if (!enrollment || enrollment.status !== "Concluída") return null;
  const activity = state.activities.find(
    (item) => item.id === enrollment.activityId,
  );
  const instructor = users.find((item) => item.id === activity?.instructorId);
  if (!activity || !instructor) return null;
  return {
    enrollmentId,
    participantName: actor.name,
    activityTitle: activity.title,
    instructorName: instructor.name,
    hours: activity.hours,
    completedAt: enrollment.completedAt,
    issuedAt,
    disclaimer: certificateDisclaimer,
  };
}
