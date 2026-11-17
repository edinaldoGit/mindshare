import { demoConfig, institutionConfig } from "../../data/demo-config.ts";
import { demoUsers } from "../../data/demo-data.ts";
import type { User } from "../../types/domain.ts";

export const normalizeEmail = (value: string) => value.trim().toLowerCase();
export function isDemoEmail(email: string) {
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    normalizeEmail(email).split("@")[1] === demoConfig.emailDomain
  );
}
export function acceptsConfiguredInstitutionEmail(email: string) {
  return (
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    institutionConfig.approvedDomains.includes(
      normalizeEmail(email).split("@")[1],
    )
  );
}
export function authenticateDemo(
  email: string,
  password: string,
  users: User[] = demoUsers,
): User | null {
  if (password !== demoConfig.password) return null;
  return users.find((user) => user.email === normalizeEmail(email)) ?? null;
}
export function safeReturnPath(
  value: string | null | undefined,
): string | null {
  if (
    !value ||
    !/^\/(atividades\/[^/?#]+|catalogo(?:\?[^#]*)?|participante(?:\/[^?#]*)?|instrutor(?:\/[^?#]*)?|curadoria(?:\/[^?#]*)?|administracao(?:\/[^?#]*)?)$/.test(
      value,
    )
  )
    return null;
  return value;
}
export function homeForUser(user: User) {
  return user.kind === "Administrador"
    ? "/administracao"
    : user.kind === "Professor Curador"
      ? "/curadoria"
      : "/participante";
}
export function canAccessArea(
  user: User | null,
  area: "public" | "participant" | "instructor" | "curation" | "administration",
) {
  return (
    area === "public" ||
    (area === "administration"
      ? user?.kind === "Administrador"
      : area === "curation"
        ? user?.kind === "Professor Curador" &&
          user.active !== false &&
          user.verified !== false
        : user?.kind === "Discente")
  );
}
export function returnAfterLogin(user: User, destination: string | null) {
  const safe = safeReturnPath(destination);
  if (
    !safe ||
    (safe.startsWith("/administracao") && user.kind !== "Administrador") ||
    (safe.startsWith("/curadoria") && user.kind !== "Professor Curador") ||
    (/^\/(instrutor|participante)/.test(safe) && user.kind !== "Discente")
  )
    return homeForUser(user);
  return safe;
}
export type RegistrationValues = {
  name: string;
  email: string;
  password: string;
  confirmation: string;
  consent: boolean;
};
export function validateRegistration(values: RegistrationValues) {
  const errors: Partial<Record<keyof RegistrationValues, string>> = {};
  if (values.name.trim().length < 2)
    errors.name = "Informe um nome fictício com pelo menos 2 caracteres.";
  if (!isDemoEmail(values.email))
    errors.email = "Use um endereço fictício terminado em @mindshare.test.";
  if (values.password.length < 8)
    errors.password = "Crie uma senha de exemplo com pelo menos 8 caracteres.";
  if (values.confirmation !== values.password || !values.confirmation)
    errors.confirmation = "As senhas precisam ser iguais.";
  if (!values.consent)
    errors.consent = "Marque o consentimento para continuar a demonstração.";
  return errors;
}
export type LoginAttempts = { failures: number; blockedUntil: number };
export function recordInvalidAttempt(
  previous: LoginAttempts,
  now: number,
): LoginAttempts {
  if (previous.blockedUntil > now) return previous;
  const failures = (previous.blockedUntil > 0 ? 0 : previous.failures) + 1;
  return { failures, blockedUntil: failures >= 5 ? now + 15 * 60 * 1000 : 0 };
}
