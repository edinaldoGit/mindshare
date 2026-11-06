import type { User } from "../../types/domain.ts";
export function isStudioUrlEnabled(url: string) {
  try {
    return new URL(url).searchParams.get("demo") === "1";
  } catch {
    return false;
  }
}
export function loginPrefill(url: string, hashQuery: string, users: User[]) {
  const account = new URLSearchParams(hashQuery).get("conta");
  return isStudioUrlEnabled(url) && users.some((u) => u.email === account)
    ? (account ?? "")
    : "";
}
