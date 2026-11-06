export type PlannedRoute = {
  path: string;
  title: string;
  area: "public" | "participant" | "instructor" | "curation" | "administration";
};
export const plannedRoutes: PlannedRoute[] = [
  { path: "/catalogo", title: "Catálogo de atividades", area: "public" },
  {
    path: "/atividades/:activityId",
    title: "Detalhes da atividade",
    area: "public",
  },
  { path: "/entrar", title: "Entrar", area: "public" },
  { path: "/cadastro", title: "Criar conta", area: "public" },
  { path: "/participante", title: "Área do participante", area: "participant" },
  {
    path: "/participante/inscricoes",
    title: "Minhas inscrições",
    area: "participant",
  },
  {
    path: "/participante/atividades/:activityId",
    title: "Acompanhamento da atividade",
    area: "participant",
  },
  {
    path: "/participante/historico",
    title: "Histórico de carga horária",
    area: "participant",
  },
  {
    path: "/participante/comprovantes",
    title: "Comprovantes",
    area: "participant",
  },
  {
    path: "/participante/recomendacoes",
    title: "Descobrir por interesse",
    area: "participant",
  },
  { path: "/instrutor", title: "Área do instrutor", area: "instructor" },
  {
    path: "/instrutor/propostas",
    title: "Minhas propostas",
    area: "instructor",
  },
  {
    path: "/instrutor/propostas/nova",
    title: "Nova proposta",
    area: "instructor",
  },
  {
    path: "/instrutor/propostas/:id",
    title: "Detalhes da proposta",
    area: "instructor",
  },
  {
    path: "/instrutor/propostas/:id/editar",
    title: "Ajustar proposta",
    area: "instructor",
  },
  {
    path: "/instrutor/propostas/:id/participantes",
    title: "Redirecionamento legado",
    area: "instructor",
  },
  {
    path: "/instrutor/atividades",
    title: "Minhas atividades",
    area: "instructor",
  },
  {
    path: "/instrutor/atividades/:activityId/participantes",
    title: "Participantes e conclusões",
    area: "instructor",
  },
  {
    path: "/curadoria/historico",
    title: "Histórico de decisões",
    area: "curation",
  },
  { path: "/curadoria", title: "Área de curadoria", area: "curation" },
  {
    path: "/curadoria/propostas",
    title: "Fila de propostas",
    area: "curation",
  },
  {
    path: "/curadoria/propostas/:activityId",
    title: "Análise da proposta",
    area: "curation",
  },
];
export const areaLabels = {
  public: "MindShare",
  participant: "Participante",
  instructor: "Instrutor",
  curation: "Professor Curador",
  administration: "Administração",
};
