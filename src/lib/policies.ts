import type { Activity, User } from "../types/domain.ts";

export const canCreateProposal = (user: User | null) =>
  user?.kind === "Discente";
export const canCurate = (user: User | null) =>
  user?.kind === "Professor Curador";
export const canEditProposal = (user: User | null, activity: Activity) =>
  user?.kind === "Discente" &&
  user.id === activity.instructorId &&
  activity.status === "Ajustes solicitados";
export const isPublished = (activity: Activity) =>
  activity.status === "Aprovada";
