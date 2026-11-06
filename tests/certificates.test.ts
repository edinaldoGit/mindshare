import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PDFDocument } from "pdf-lib";
import { createInitialState } from "../src/lib/demo/state.ts";
import { demoStudent, demoCurator, demoUsers } from "../src/data/demo-data.ts";
import {
  certificateData,
  certificateLabel,
  certificateDisclaimer,
} from "../src/features/certificates/certificate-data.ts";
import { generateCertificatePdf } from "../src/features/certificates/certificate-pdf.ts";
const now = "2026-11-05T01:00:00.000Z";
const enrollmentId = "inscricao-web-acessivel-0";
test("RF22: comprovante inclui participante, atividade, instrutor, horas e conclusão corretos", () => {
  const data = certificateData(
    createInitialState(),
    demoUsers,
    demoStudent,
    enrollmentId,
    now,
  );
  assert.ok(data);
  assert.equal(data.participantName, "Alex Costa");
  assert.equal(
    data.activityTitle,
    "Uma web que inclui: acessibilidade na prática",
  );
  assert.equal(data.instructorName, "Renê Lima");
  assert.equal(data.hours, 6);
  assert.equal(data.completedAt, "2026-11-04T15:00:00.000Z");
});
test("RF23: aviso obrigatório e identificação demonstrativa explícitos", () => {
  assert.equal(
    certificateData(
      createInitialState(),
      demoUsers,
      demoStudent,
      enrollmentId,
      now,
    )?.disclaimer,
    "A emissão deste comprovante não garante o reconhecimento da carga horária pela UFC.",
  );
  assert.equal(
    certificateLabel,
    "Comprovante demonstrativo | Protótipo MindShare",
  );
});
test("RF22: inscrição não concluída, inexistente, de outro usuário e Curador não emitem", async () => {
  const state = createInitialState();
  for (const [actor, id] of [
    [demoStudent, "inscricao-python-primeiros-passos-0"],
    [demoStudent, "inexistente"],
    [
      demoUsers.find((user) => user.id === "participante-exemplo-1")!,
      enrollmentId,
    ],
    [demoCurator, enrollmentId],
    [null, enrollmentId],
  ] as const) {
    assert.equal(certificateData(state, demoUsers, actor, id, now), null);
    await assert.rejects(() =>
      generateCertificatePdf(state, demoUsers, actor, id),
    );
  }
});
test("RF22/RF23: gera PDF válido de uma página com logo original e metadados demonstrativos", async () => {
  const logo = new Uint8Array(
    await readFile(new URL("../public/brand/logo.png", import.meta.url)),
  );
  const bytes = await generateCertificatePdf(
    createInitialState(),
    demoUsers,
    demoStudent,
    enrollmentId,
    { logoBytes: logo, issuedAt: now },
  );
  const pdf = await PDFDocument.load(bytes);
  assert.equal(pdf.getPageCount(), 1);
  assert.ok(pdf.getTitle()?.includes(certificateLabel));
  assert.equal(pdf.getSubject(), certificateDisclaimer);
  assert.ok(bytes.length > 1000);
});
test("RF22: cada conclusão produz dados e documento próprios, sem PDF fixo", async () => {
  const state = createInitialState(),
    other = "inscricao-comunicacao-cientifica-0";
  const a = certificateData(state, demoUsers, demoStudent, enrollmentId, now),
    b = certificateData(state, demoUsers, demoStudent, other, now);
  assert.notEqual(a?.activityTitle, b?.activityTitle);
  assert.notEqual(a?.hours, b?.hours);
  const pdfA = await PDFDocument.load(
    await generateCertificatePdf(state, demoUsers, demoStudent, enrollmentId, {
      issuedAt: now,
    }),
  );
  const pdfB = await PDFDocument.load(
    await generateCertificatePdf(state, demoUsers, demoStudent, other, {
      issuedAt: now,
    }),
  );
  assert.notEqual(pdfA.getTitle(), pdfB.getTitle());
});
