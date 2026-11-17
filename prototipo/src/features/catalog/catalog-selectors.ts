import type { Activity, Enrollment } from "../../types/domain.ts";
import { isPublished } from "../../lib/policies.ts";

export interface CatalogFilters {
  query: string;
  area: string;
  minHours: string;
  maxHours: string;
  format: string;
  onlyAvailable: boolean;
}
export const emptyFilters: CatalogFilters = {
  query: "",
  area: "",
  minHours: "",
  maxHours: "",
  format: "",
  onlyAvailable: false,
};
export const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
export const publishedActivities = (activities: Activity[]) =>
  activities.filter(isPublished);
export const findPublishedActivity = (
  activities: Activity[],
  id: string | undefined,
) => publishedActivities(activities).find((activity) => activity.id === id);
export const availableSeats = (activity: Activity, enrollments: Enrollment[]) =>
  Math.max(
    0,
    activity.capacity -
      enrollments.filter((enrollment) => enrollment.activityId === activity.id)
        .length,
  );
export function filterActivities(
  activities: Activity[],
  enrollments: Enrollment[],
  filters: CatalogFilters,
) {
  const query = normalizeSearch(filters.query);
  return publishedActivities(activities).filter(
    (activity) =>
      (!query ||
        normalizeSearch(`${activity.title} ${activity.syllabus}`).includes(
          query,
        )) &&
      (!filters.area || activity.thematicArea === filters.area) &&
      (!filters.format || activity.format === filters.format) &&
      (!filters.minHours || activity.hours >= Number(filters.minHours)) &&
      (!filters.maxHours || activity.hours <= Number(filters.maxHours)) &&
      (!filters.onlyAvailable || availableSeats(activity, enrollments) > 0),
  );
}
export function readCatalogFilters(params: URLSearchParams): CatalogFilters {
  const hours = (key: string) => {
    const value = params.get(key) ?? "";
    return value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0
      ? value
      : "";
  };
  return {
    query: params.get("busca") ?? "",
    area: params.get("area") ?? "",
    minHours: hours("min"),
    maxHours: hours("max"),
    format: params.get("formato") ?? "",
    onlyAvailable: params.get("vagas") === "sim",
  };
}
export function writeCatalogFilters(filters: CatalogFilters) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({
    busca: filters.query,
    area: filters.area,
    min: filters.minHours,
    max: filters.maxHours,
    formato: filters.format,
    vagas: filters.onlyAvailable ? "sim" : "",
  }))
    if (value) params.set(key, value);
  return params;
}
