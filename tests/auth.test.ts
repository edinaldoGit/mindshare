import test from "node:test";
import assert from "node:assert/strict";
import { demoStudent, demoLearner, demoCurator } from "../src/data/demo-data.ts";
import { demoConfig, institutionConfig } from "../src/data/demo-config.ts";
import {
  authenticateDemo,
  validateRegistration,
  isDemoEmail,
  acceptsConfiguredInstitutionEmail,
  canAccessArea,
  safeReturnPath,
  returnAfterLogin,
  recordInvalidAttempt,
} from "../src/features/auth/auth-rules.ts";

test("RF02 parcial: somente pares de credenciais fictícias são aceitos", () => {
  assert.equal(
    authenticateDemo(" DISCENTE@MINDSHARE.TEST ", demoConfig.password)?.id,
    demoStudent.id,
  );
  assert.equal(
    authenticateDemo(demoConfig.curatorEmail, demoConfig.password)?.kind,
    "Professor Curador",
  );
  assert.equal(authenticateDemo(demoLearner.email, demoConfig.password)?.id, demoLearner.id);
  assert.equal(authenticateDemo(demoConfig.studentEmail, "incorreta"), null);
  assert.equal(
    authenticateDemo("desconhecido@mindshare.test", demoConfig.password),
    null,
  );
});
test("RF01 parcial: domínio de exemplo é exato; validação oficial segue pendente", () => {
  assert.ok(isDemoEmail("teste@mindshare.test"));
  for (const email of [
    "teste@gmail.com",
    "teste@mindshare.test.evil",
    "invalido",
    "teste@@mindshare.test",
  ])
    assert.equal(isDemoEmail(email), false);
  assert.equal(institutionConfig.approvedDomains.length, 0);
  assert.equal(acceptsConfiguredInstitutionEmail("teste@ufc.br"), false);
});
test("Cadastro valida campos, consentimento e confirmação de senha", () => {
  const values = {
    name: "",
    email: "externo@gmail.com",
    password: "curta",
    confirmation: "outra",
    consent: false,
  };
  assert.deepEqual(Object.keys(validateRegistration(values)), [
    "name",
    "email",
    "password",
    "confirmation",
    "consent",
  ]);
  assert.deepEqual(
    validateRegistration({
      name: "Pessoa Fictícia",
      email: "teste@mindshare.test",
      password: "exemplo123",
      confirmation: "exemplo123",
      consent: true,
    }),
    {},
  );
});
test("RF03 parcial: Discente participa e ensina com a mesma identidade; sem curadoria", () => {
  assert.ok(canAccessArea(demoStudent, "participant"));
  assert.ok(canAccessArea(demoStudent, "instructor"));
  assert.equal(canAccessArea(demoStudent, "curation"), false);
});
test("RF03 parcial: Professor Curador não recebe funcionalidades de Discente", () => {
  assert.ok(canAccessArea(demoCurator, "curation"));
  assert.equal(canAccessArea(demoCurator, "instructor"), false);
  assert.equal(canAccessArea(demoCurator, "participant"), false);
  assert.equal(canAccessArea(null, "curation"), false);
});
test("Retorno preserva atividade e impede redirecionamento externo ou área de outro perfil", () => {
  assert.equal(
    returnAfterLogin(demoStudent, "/atividades/interfaces-figma"),
    "/atividades/interfaces-figma",
  );
  assert.equal(returnAfterLogin(demoStudent, "/instrutor"), "/instrutor");
  assert.equal(returnAfterLogin(demoStudent, "/curadoria"), "/participante");
  assert.equal(
    returnAfterLogin(demoCurator, "/instrutor/propostas/nova"),
    "/curadoria",
  );
  for (const value of [
    "https://example.com",
    "//example.com",
    "/entrar",
    "/\\example.com",
  ])
    assert.equal(safeReturnPath(value), null);
});
test("RNF10 parcial: quinta falha bloqueia 15 minutos; expiração reinicia contador", () => {
  let attempts = { failures: 0, blockedUntil: 0 };
  for (let index = 0; index < 5; index++)
    attempts = recordInvalidAttempt(attempts, 1000);
  assert.equal(attempts.failures, 5);
  assert.equal(attempts.blockedUntil, 901000);
  assert.deepEqual(recordInvalidAttempt(attempts, 2000), attempts);
  assert.deepEqual(recordInvalidAttempt(attempts, 901001), {
    failures: 1,
    blockedUntil: 0,
  });
});
