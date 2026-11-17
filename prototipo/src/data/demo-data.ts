import type { Activity, Enrollment, User } from "../types/domain.ts";
import { demoConfig } from "./demo-config.ts";

const consentAt = "2026-11-01T12:00:00.000Z";
export const demoStudent: User = {
  id: "discente-demo",
  name: "Alex Costa",
  email: demoConfig.studentEmail,
  kind: "Discente",
  consentAt,
};
export const demoCurator: User = {
  id: "curador-demo",
  name: "Helena Prado",
  email: demoConfig.curatorEmail,
  kind: "Professor Curador",
  active: true,
  verified: true,
  consentAt,
};
export const demoLearner: User = {
  id: "discente-participante-demo",
  name: "Júlia Torres",
  email: "julia@mindshare.test",
  kind: "Discente",
  consentAt,
};
export const instructors: User[] = [
  {
    id: "inst-lia",
    name: "Lia Martins",
    email: "lia@mindshare.test",
    kind: "Discente",
    consentAt,
  },
  {
    id: "inst-caio",
    name: "Caio Nunes",
    email: "caio@mindshare.test",
    kind: "Discente",
    consentAt,
  },
  {
    id: "inst-nina",
    name: "Nina Alves",
    email: "nina@mindshare.test",
    kind: "Discente",
    consentAt,
  },
  {
    id: "inst-rene",
    name: "Renê Lima",
    email: "rene@mindshare.test",
    kind: "Discente",
    consentAt,
  },
];
// Vocabulário de exemplo: não é uma classificação oficial de horas da UFC.
type SeedRow = [
  string,
  string,
  string,
  string,
  number,
  string,
  Activity["activityType"],
  number,
  number,
];
const rows: SeedRow[] = [
  [
    "interfaces-figma",
    "Do primeiro wireframe ao protótipo no Figma",
    "Design",
    "Dê forma às suas ideias com hierarquia visual, componentes e prototipação de interfaces.",
    6,
    "Presencial",
    "Oficina",
    24,
    7,
  ],
  [
    "python-primeiros-passos",
    "Python: seu primeiro passo na programação",
    "Programação",
    "Aprenda variáveis, estruturas de decisão e repetição construindo um pequeno projeto.",
    8,
    "Remoto",
    "Minicurso",
    30,
    12,
  ],
  [
    "comunicacao-cientifica",
    "Sua pesquisa merece uma boa história",
    "Comunicação científica",
    "Organize argumentos, prepare apresentações e comunique resultados de pesquisa com clareza.",
    4,
    "Presencial",
    "Oficina",
    20,
    5,
  ],
  [
    "web-acessivel",
    "Uma web que inclui: acessibilidade na prática",
    "Desenvolvimento web",
    "Explore HTML semântico, navegação por teclado e contraste em experiências digitais.",
    6,
    "Remoto",
    "Oficina",
    25,
    9,
  ],
  [
    "sql-sem-misterio",
    "SQL sem mistério",
    "Banco de dados",
    "Investigue conjuntos de dados com consultas, junções e agrupamentos em bancos relacionais.",
    10,
    "Presencial",
    "Minicurso",
    20,
    0,
  ],
  [
    "algebra-linear",
    "Álgebra linear, uma ideia de cada vez",
    "Matemática",
    "Construa intuição sobre vetores, matrizes e transformações por meio de exercícios coletivos.",
    12,
    "Remoto",
    "Grupo de estudo",
    16,
    6,
  ],
  [
    "ia-responsavel",
    "Inteligência artificial com responsabilidade",
    "Inteligência artificial",
    "Discuta vieses, limites dos modelos e avaliação crítica de ferramentas de IA.",
    4,
    "Remoto",
    "Aula",
    30,
    15,
  ],
  [
    "algoritmos",
    "Pensar antes de programar: algoritmos",
    "Programação",
    "Resolva problemas com decomposição, pseudocódigo e análise de estratégias.",
    8,
    "Presencial",
    "Grupo de estudo",
    18,
    4,
  ],
  [
    "portfolio",
    "Um portfólio que conta a sua trajetória",
    "Desenvolvimento profissional",
    "Selecione projetos e descreva processos, aprendizados e decisões para apresentar seu trabalho.",
    3,
    "Remoto",
    "Oficina",
    20,
    1,
  ],
  [
    "react-componentes",
    "React: construindo com componentes",
    "Desenvolvimento web",
    "Pratique composição, propriedades e estado local em uma interface interativa.",
    10,
    "Presencial",
    "Minicurso",
    24,
    8,
  ],
  [
    "design-pesquisa",
    "Antes da interface, escute as pessoas",
    "Design",
    "Conheça entrevistas exploratórias, síntese de descobertas e pesquisa com usuários.",
    5,
    "Remoto",
    "Oficina",
    18,
    0,
  ],
  [
    "latex-academico",
    "LaTeX para trabalhos acadêmicos",
    "Comunicação científica",
    "Estruture documentos, referências bibliográficas e expressões matemáticas com LaTeX.",
    6,
    "Presencial",
    "Minicurso",
    22,
    10,
  ],
];
export const demoActivities: Activity[] = rows.map(
  (
    [id, title, thematicArea, summary, hours, format, activityType, capacity],
    index,
  ) => ({
    id,
    title,
    thematicArea,
    summary,
    hours,
    format,
    activityType,
    capacity,
    syllabus: `${summary} A atividade combina uma introdução aos conceitos, exemplos comentados e uma prática colaborativa. Ao final, o grupo compartilha soluções e discute os aprendizados. Não é necessário conhecimento avançado para acompanhar a proposta.`,
    instructorId: instructors[index % instructors.length].id,
    category: "Formação complementar — exemplo",
    status: "Aprovada",
    submittedAt: "2026-11-01T12:00:00.000Z",
    decisions: [
      {
        id: `decisao-${id}`,
        curatorId: demoCurator.id,
        outcome: "Aprovada",
        decidedAt: "2026-11-02T12:00:00.000Z",
      },
    ],
    createdAt: "2026-11-01T12:00:00.000Z",
  }),
);
// Incluídos na mesma coleção para testar RF11, inclusive o acesso por ID.
for (const [index, status] of (
  ["Rascunho", "Em análise", "Ajustes solicitados", "Rejeitada"] as const
).entries()) {
  demoActivities.push({
    ...demoActivities[index],
    id: `proposta-interna-${index}`,
    title: `Proposta interna ${status}`,
    status,
    decisions: [],
  });
}
// Dados da Etapa 4, mantidos separados da fixture do catálogo usada nas
// jornadas anteriores e unidos ao mesmo snapshot inicial.
const stageFourActivity: Activity = {
  id: "atividade-alex-oficina",
  title: "Interfaces colaborativas: da ideia ao protótipo",
  thematicArea: "Design de interação",
  summary: "Explore princípios visuais e prototipação em grupo.",
  syllabus:
    "Explore princípios visuais, hierarquia e prototipação por meio de exercícios colaborativos.",
  hours: 6,
  format: "Presencial",
  activityType: "Oficina",
  category: "Formação complementar — exemplo",
  capacity: 12,
  instructorId: demoStudent.id,
  status: "Aprovada",
  submittedAt: "2026-10-30T12:00:00.000Z",
  createdAt: "2026-10-29T12:00:00.000Z",
  decisions: [
    {
      id: "decisao-atividade-alex",
      curatorId: demoCurator.id,
      outcome: "Aprovada",
      decidedAt: "2026-10-31T12:00:00.000Z",
    },
  ],
};
const proposalExamples: Array<{
  id: string;
  title: string;
  status: Activity["status"];
  date: string;
}> = [
  {
    id: "proposta-alex-rascunho",
    title: "Laboratório de ideias digitais",
    status: "Rascunho",
    date: "2026-11-02T12:00:00.000Z",
  },
  {
    id: "proposta-alex-analise",
    title: "Narrativas para projetos científicos",
    status: "Em análise",
    date: "2026-11-03T12:00:00.000Z",
  },
  {
    id: "proposta-alex-ajustes",
    title: "Design acessível em equipes",
    status: "Ajustes solicitados",
    date: "2026-11-04T12:00:00.000Z",
  },
  {
    id: "proposta-alex-rejeitada",
    title: "Ferramentas para organização pessoal",
    status: "Rejeitada",
    date: "2026-11-01T12:00:00.000Z",
  },
];
const stageFourEmptyActivity: Activity = {
  id: "atividade-alex-sem-inscritos",
  title: "Roda de conversa sobre documentação clara",
  thematicArea: "Desenvolvimento profissional",
  summary: "Troque experiências sobre textos técnicos que acolhem quem lê.",
  syllabus:
    "Uma conversa guiada sobre escrita técnica, organização de informação e leitura inclusiva.",
  hours: 3,
  format: "Remoto",
  activityType: "Grupo de estudo",
  category: "Formação complementar — exemplo",
  capacity: 10,
  instructorId: demoStudent.id,
  status: "Aprovada",
  submittedAt: "2026-10-26T12:00:00.000Z",
  createdAt: "2026-10-25T12:00:00.000Z",
  decisions: [
    {
      id: "decisao-atividade-alex-vazia",
      curatorId: demoCurator.id,
      outcome: "Aprovada",
      decidedAt: "2026-10-27T12:00:00.000Z",
    },
  ],
};
export const stageFourActivities: Activity[] = [
  stageFourActivity,
  stageFourEmptyActivity,
];
for (const proposal of proposalExamples) {
  const adjustment = proposal.status === "Ajustes solicitados";
  const rejected = proposal.status === "Rejeitada";
  const stageFourProposal: Activity = {
    ...demoActivities[0],
    id: proposal.id,
    title: proposal.title,
    status: proposal.status,
    instructorId: demoStudent.id,
    summary: "Proposta demonstrativa para acompanhar a jornada de curadoria.",
    syllabus:
      "Uma proposta fictícia usada para demonstrar o acompanhamento e os estados de curadoria.",
    thematicArea: "Design de interação",
    createdAt: "2026-10-28T12:00:00.000Z",
    submittedAt: proposal.status === "Rascunho" ? undefined : proposal.date,
    decisions:
      adjustment || rejected
        ? [
            {
              id: `decisao-${proposal.id}`,
              curatorId: demoCurator.id,
              outcome: proposal.status as "Ajustes solicitados" | "Rejeitada",
              reason: adjustment
                ? "Inclua uma descrição mais clara das atividades práticas e indique como a acessibilidade será considerada."
                : "A proposta não se alinha ao escopo demonstrativo desta chamada.",
              decidedAt: proposal.date,
            },
          ]
        : [],
  };
  if (proposal.status === "Rascunho") delete stageFourProposal.submittedAt;
  stageFourActivities.push(stageFourProposal);
}
// Vagas são derivadas das inscrições, nunca de um segundo contador no card.
export const demoEnrollments: Enrollment[] = rows.flatMap(
  ([activityId, , , , , , , capacity, available]) =>
    Array.from({ length: capacity - available }, (_, index) => ({
      id: `inscricao-${activityId}-${index}`,
      activityId,
      participantId: `participante-exemplo-${index}`,
      status: "Inscrito" as const,
      enrolledAt: consentAt,
    })),
);
export const stageFourEnrollments: Enrollment[] = [
  {
    id: "inscricao-julia-atividade-alex",
    activityId: "atividade-alex-oficina",
    participantId: demoLearner.id,
    status: "Inscrito",
    enrolledAt: "2026-11-03T14:00:00.000Z",
  },
];
const fixtureParticipants: User[] = Array.from({ length: 30 }, (_, index) => ({
  id: `participante-exemplo-${index}`,
  name: `Participante fictício ${index + 1}`,
  email: `exemplo${index + 1}@mindshare.test`,
  kind: "Discente",
  consentAt,
}));
export const extraUsers: User[] = [
  {
    id: "curador-marcos",
    name: "Marcos Azevedo",
    email: "marcos@mindshare.test",
    kind: "Professor Curador",
    active: true,
    verified: true,
    consentAt,
  },
  {
    id: "curador-beatriz",
    name: "Beatriz Lima",
    email: "beatriz@mindshare.test",
    kind: "Professor Curador",
    active: true,
    verified: true,
    consentAt,
  },
  {
    id: "admin-demo",
    name: "Clara Mendes",
    email: "admin@mindshare.test",
    kind: "Administrador",
    consentAt,
  },
];
export const demoUsers = [
  ...extraUsers,
  demoStudent,
  demoLearner,
  demoCurator,
  ...instructors,
  ...fixtureParticipants,
];

// Um ciclo anterior real da fixture continua consultável após o reenvio.
const resubmittedExample = stageFourActivities.find(
  (item) => item.id === "proposta-alex-analise",
);
if (resubmittedExample)
  resubmittedExample.decisions.push({
    id: "decisao-ajustes-narrativas",
    curatorId: demoCurator.id,
    outcome: "Ajustes solicitados",
    decidedAt: "2026-11-02T15:00:00.000Z",
    reason:
      "Detalhe a prática de apresentação e os materiais que serão compartilhados com os participantes.",
  });
export const stageFiveActivities: Activity[] = [
  {
    ...stageFourEmptyActivity,
    id: "proposta-curadoria-escrita",
    title: "Escrita científica: argumentos que conectam",
    summary:
      "Uma oficina colaborativa para organizar argumentos e revisar resumos científicos.",
    syllabus:
      "A oficina parte da leitura de resumos fictícios para discutir estrutura, clareza e encadeamento de argumentos. Em duplas, os participantes revisam um texto curto e compartilham as decisões de escrita. A prática final propõe uma revisão coletiva orientada por critérios de legibilidade e coerência. Não é necessário ter uma pesquisa em andamento.",
    instructorId: instructors[2].id,
    thematicArea: "Comunicação científica",
    activityType: "Oficina",
    hours: 4,
    capacity: 15,
    status: "Em análise",
    createdAt: "2026-11-01T10:00:00.000Z",
    submittedAt: "2026-11-04T10:00:00.000Z",
    decisions: [],
  },
];
