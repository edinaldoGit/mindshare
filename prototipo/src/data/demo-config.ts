// Domínios oficiais continuam pendentes. .test é reservado para exemplos.
export const institutionConfig = {
  approvedDomains: [] as string[],
  verificationPending: true,
};
export const demoConfig = {
  emailDomain: "mindshare.test",
  password: "demonstracao",
  studentEmail: "discente@mindshare.test",
  curatorEmail: "curador@mindshare.test",
} as const;
