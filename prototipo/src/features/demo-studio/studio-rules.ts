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

export function studioLoginPath(account: User) {
  const home =
    account.kind === "Administrador"
      ? "/administracao"
      : account.kind === "Professor Curador"
        ? "/curadoria"
        : account.id === "discente-demo"
          ? "/instrutor"
          : "/participante";
  return `/entrar?conta=${encodeURIComponent(account.email)}&retorno=${encodeURIComponent(home)}`;
}
