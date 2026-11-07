// Contratos compartilhados entre Participante, Instrutor e Professor Curador.
export type User = {
  id: string;
  name: string;
  email: string;
  consentAt: string;
} & (
  | { kind: "Discente" }
  | { kind: "Professor Curador"; active?: boolean; verified?: boolean }
  | { kind: "Administrador" }
);
export type StudentContext = "Participante" | "Instrutor";
export type ProposalStatus =
  "Rascunho" | "Em análise" | "Ajustes solicitados" | "Aprovada" | "Rejeitada";
export type CurationDecision = {
  id: string;
  curatorId: string;
  decidedAt: string;
} & (
  | { outcome: "Aprovada" }
  | { outcome: "Rejeitada" | "Ajustes solicitados"; reason: string }
);
export interface Activity {
  id: string;
  instructorId: string;
  title: string;
  summary: string;
  activityType: "Aula" | "Minicurso" | "Oficina" | "Grupo de estudo";
  syllabus: string;
  hours: number;
  format: string;
  category: string;
  thematicArea: string;
  capacity: number;
  status: ProposalStatus;
  submittedAt?: string;
  decisions: CurationDecision[];
  createdAt?: string;
  curatorId?: string;
  assignments?: Assignment[];
  delivery?: Delivery;
  legacyCompletion?: boolean;
}
export type Enrollment = {
  id: string;
  activityId: string;
  participantId: string;
  enrolledAt: string;
} & (
  | { status: "Inscrito"; completedAt?: never }
  | { status: "Concluída"; completedAt: string }
);
export interface CertificateSnapshot {
  enrollmentId: string;
  participantName: string;
  instructorName: string;
  activityTitle: string;
  hours: number;
  completedAt: string;
  issuedAt: string;
  disclaimer: string;
}
export interface DemoState {
  version: 3;
  users: User[];
  applications: FacultyApplication[];
  attendance: Attendance[];
  progress: VideoProgress[];
  activities: Activity[];
  enrollments: Enrollment[];
}

export type Assignment = {
  from: string;
  to: string;
  adminId: string;
  at: string;
  reason: string;
};
export type Meeting = {
  subject?: string;
  updatedAt?: string;
  updatedBy?: string;
  id: string;
  date: string;
  duration: number;
  status: "Planejado" | "Realizado" | "Cancelado";
};
export type Lesson = {
  description?: string;
  id: string;
  title: string;
  src: string;
  duration: number;
  required: boolean;
};
export type Delivery = {
  minimum: number;
  location: string;
  link: string;
  instructions: string;
  meetings: Meeting[];
  lessons: Lesson[];
  closed: boolean;
};
export type FacultyApplication = {
  id: string;
  name: string;
  email: string;
  department: string;
  method: "Administrativa" | "Institucional simulada";
  evidence: string;
  status: "Pendente" | "Aprovada" | "Rejeitada";
  createdAt: string;
  reason?: string;
  decidedAt?: string;
  decidedBy?: string;
  userId?: string;
};
export type Attendance = {
  activityId: string;
  meetingId: string;
  participantId: string;
  present: boolean;
  recordedAt: string;
  instructorId: string;
};
export type VideoProgress = {
  activityId: string;
  lessonId: string;
  participantId: string;
  intervals: [number, number][];
  position: number;
  confirmedSeconds?: number;
  checkpoints: number[];
};
