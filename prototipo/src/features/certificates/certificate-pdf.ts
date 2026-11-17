import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import type { DemoState, User } from "../../types/domain.ts";
import { certificateData, certificateLabel } from "./certificate-data.ts";
import { formatDate } from "../../lib/date.ts";

function wrap(
  text: string,
  font: PDFFont,
  size: number,
  width: number,
): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= width) {
      line = candidate;
      continue;
    }
    if (line) {
      lines.push(line);
      line = "";
    }
    for (const letter of word) {
      if (line && font.widthOfTextAtSize(line + letter, size) > width) {
        lines.push(line);
        line = "";
      }
      line += letter;
    }
  }
  if (line) lines.push(line);
  return lines;
}
export async function generateCertificatePdf(
  state: DemoState,
  users: User[],
  actor: User | null,
  enrollmentId: string,
  options: { logoBytes?: Uint8Array; issuedAt?: string } = {},
): Promise<Uint8Array> {
  const data = certificateData(
    state,
    users,
    actor,
    enrollmentId,
    options.issuedAt ?? new Date().toISOString(),
  );
  if (!data)
    throw new Error(
      "O comprovante está disponível apenas para uma atividade concluída pelo participante atual.",
    );
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${certificateLabel} - ${data.activityTitle}`);
  pdf.setAuthor("MindShare - protótipo acadêmico");
  pdf.setSubject(data.disclaimer);
  pdf.setCreator("MindShare - geração local no navegador");
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([595.28, 841.89]);
  const ink = rgb(0.09, 0.18, 0.23),
    muted = rgb(0.32, 0.39, 0.45),
    blue = rgb(0.14, 0.37, 0.57),
    mint = rgb(0.27, 0.73, 0.64);
  const text = (
    value: string,
    x: number,
    y: number,
    size: number,
    strong = false,
    color = ink,
  ) =>
    page.drawText(value, { x, y, size, font: strong ? bold : regular, color });
  page.drawRectangle({ x: 0, y: 836, width: 595.28, height: 6, color: mint });
  if (options.logoBytes) {
    const logo = await pdf.embedPng(options.logoBytes);
    const dimensions = logo.scale(178 / logo.width);
    page.drawImage(logo, { x: 48, y: 752, ...dimensions });
  } else text("MindShare", 48, 766, 23, true, blue);
  text("APRENDER. COMPARTILHAR.", 365, 772, 8, false, muted);
  page.drawLine({
    start: { x: 48, y: 726 },
    end: { x: 547, y: 726 },
    thickness: 0.7,
    color: rgb(0.85, 0.88, 0.91),
  });
  text(certificateLabel, 48, 698, 11, false, blue);
  text("Uma troca que", 48, 650, 32, true);
  text("virou aprendizado.", 48, 612, 32, true, blue);
  text("PARTICIPANTE", 48, 563, 9, true, muted);
  let y = 535;
  for (const line of wrap(data.participantName, bold, 22, 499)) {
    text(line, 48, y, 22, true);
    y -= 27;
  }
  y -= 9;
  text(
    "Concluiu a participação na atividade demonstrativa:",
    48,
    y,
    11,
    false,
    muted,
  );
  y -= 31;
  const titleLines = wrap(data.activityTitle, bold, 19, 499);
  for (const line of titleLines) {
    text(line, 48, y, 19, true);
    y -= 25;
  }
  y -= 23;
  if (y < 275)
    throw new Error(
      "O conteúdo do comprovante excede o espaço disponível. Revise os dados da atividade.",
    );
  text("CARGA HORÁRIA", 48, y, 9, true, muted);
  text("CONCLUSÃO", 300, y, 9, true, muted);
  text(`${data.hours} horas`, 48, y - 25, 18, true, blue);
  text(formatDate(data.completedAt), 300, y - 25, 16, true);
  y -= 69;
  text("ESTUDANTE INSTRUTOR", 48, y, 9, true, muted);
  for (const [index, line] of wrap(
    data.instructorName,
    regular,
    15,
    499,
  ).entries())
    text(line, 48, y - 24 - index * 20, 15);
  page.drawRectangle({
    x: 48,
    y: 85,
    width: 499,
    height: 96,
    color: rgb(0.92, 0.96, 0.94),
  });
  text("SOBRE O RECONHECIMENTO DE HORAS", 64, 158, 9, true, blue);
  for (const [index, line] of wrap(
    data.disclaimer,
    regular,
    12.5,
    465,
  ).entries())
    text(line, 64, 135 - index * 18, 12.5);
  text(
    "Documento de exemplo. Sem assinatura ou autenticação institucional.",
    48,
    55,
    9,
    false,
    muted,
  );
  text(
    "UFC Quixadá: referência ao contexto acadêmico do protótipo.",
    48,
    39,
    8,
    false,
    muted,
  );
  return pdf.save();
}
