import { lazy, Suspense } from "react";
const DemoStudio = lazy(() =>
  import("@/features/demo-studio/demo-studio").then((m) => ({
    default: m.DemoStudio,
  })),
);
import { FacultyRegistration } from "@/features/administration/faculty-registration";
import {
  AdminLayout,
  AdminDashboard,
  FacultyList,
  FacultyDetail,
  CuratorManagement,
} from "@/features/administration/admin-pages";
import { AttendancePage } from "@/features/learning/attendance-page";
const VideoPage = lazy(() =>
  import("@/features/learning/video-page").then((m) => ({
    default: m.VideoPage,
  })),
);
import {
  CurationDashboard,
  CurationQueuePage,
  CurationHistoryPage,
} from "@/features/curation/curation-pages";
import { ProposalReviewPage } from "@/features/curation/proposal-review-page";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { PublicLayout } from "@/app/layouts/public-layout";
import { WorkspaceLayout } from "@/app/layouts/workspace-layout";
import { DemoProvider } from "@/app/providers/demo-provider";
import { FoundationPage } from "@/features/home/foundation-page";
import { CatalogPage } from "@/features/catalog/catalog-page";
import { ActivityDetailPage } from "@/features/activities/activity-detail-page";
import { LoginPage } from "@/features/auth/login-page";
import { RegisterPage } from "@/features/auth/register-page";
import { DevelopmentPage } from "@/components/feedback/development-page";
import { RequireProfile } from "./require-profile";
import { plannedRoutes } from "./route-config";
import { DashboardPage } from "@/features/participant/dashboard-page";
import { EnrollmentsPage } from "@/features/participant/enrollments-page";
import { HistoryPage } from "@/features/participant/history-page";
import { ParticipantActivityPage } from "@/features/participant/participant-activity-page";
import { RecommendationsPage } from "@/features/participant/recommendations-page";
import { CertificatesPage } from "@/features/certificates/certificates-page";
import {
  ActivityParticipantsPage,
  EditProposalPage,
  InstructorActivitiesPage,
  InstructorDashboard,
  InstructorProposalsPage,
  NewProposalPage,
  ProposalDetailPage,
} from "@/features/instructor/instructor-pages";
const participantPages = {
  "/participante": <DashboardPage />,
  "/participante/inscricoes": <EnrollmentsPage />,
  "/participante/historico": <HistoryPage />,
  "/participante/comprovantes": <CertificatesPage />,
  "/participante/atividades/:activityId": <ParticipantActivityPage />,
  "/participante/recomendacoes": <RecommendationsPage />,
} as const;
const instructorPages: Record<string, React.ReactNode> = {
  "/instrutor": <InstructorDashboard />,
  "/instrutor/propostas": <InstructorProposalsPage />,
  "/instrutor/propostas/nova": <NewProposalPage />,
  "/instrutor/propostas/:id": <ProposalDetailPage />,
  "/instrutor/propostas/:id/editar": <EditProposalPage />,
  "/instrutor/propostas/:id/participantes": (
    <DevelopmentPage title="Use Minhas atividades para gerenciar participantes." />
  ),
  "/instrutor/atividades": <InstructorActivitiesPage />,
  "/instrutor/atividades/:activityId/participantes": (
    <ActivityParticipantsPage />
  ),
};
const curationPages: Record<string, React.ReactNode> = {
  "/curadoria": <CurationDashboard />,
  "/curadoria/propostas": <CurationQueuePage />,
  "/curadoria/propostas/:activityId": <ProposalReviewPage />,
  "/curadoria/historico": <CurationHistoryPage />,
};
function LoginPageWrapper() {
  const location = useLocation();
  return <LoginPage key={location.key} />;
}
export function AppRouter() {
  return (
    <DemoProvider>
      <HashRouter useTransitions={false}>
        {new URLSearchParams(window.location.search).get("demo") === "1" && (
          <Suspense fallback={null}>
            <DemoStudio />
          </Suspense>
        )}
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<FoundationPage />} />
            <Route path="catalogo" element={<CatalogPage />} />
            <Route
              path="atividades/:activityId"
              element={<ActivityDetailPage />}
            />
            <Route path="entrar" element={<LoginPageWrapper />} />
            <Route path="cadastro" element={<RegisterPage />} />
            <Route
              path="cadastro/professor"
              element={<FacultyRegistration />}
            />
            <Route element={<RequireProfile area="administration" />}>
              <Route element={<AdminLayout />}>
                <Route path="administracao" element={<AdminDashboard />} />
                <Route
                  path="administracao/docentes"
                  element={<FacultyList />}
                />
                <Route
                  path="administracao/docentes/:id"
                  element={<FacultyDetail />}
                />
                <Route
                  path="administracao/curadores"
                  element={<CuratorManagement />}
                />
              </Route>
            </Route>
            <Route element={<RequireProfile area="participant" />}>
              <Route element={<WorkspaceLayout area="participant" />}>
                <Route
                  path="participante/atividades/:activityId/frequencia"
                  element={<AttendancePage />}
                />
                <Route
                  path="participante/atividades/:activityId/aulas"
                  element={
                    <Suspense fallback={<p role="status">Carregando aulas…</p>}>
                      <VideoPage />
                    </Suspense>
                  }
                />
              </Route>
            </Route>
            <Route element={<RequireProfile area="instructor" />}>
              <Route element={<WorkspaceLayout area="instructor" />}>
                <Route
                  path="instrutor/atividades/:activityId/frequencia"
                  element={<AttendancePage />}
                />
              </Route>
            </Route>
            {(["participant", "instructor", "curation"] as const).map(
              (area) => (
                <Route key={area} element={<RequireProfile area={area} />}>
                  <Route element={<WorkspaceLayout area={area} />}>
                    {plannedRoutes
                      .filter((route) => route.area === area)
                      .map((route) => (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={
                            area === "participant"
                              ? participantPages[
                                  route.path as keyof typeof participantPages
                                ]
                              : area === "instructor"
                                ? instructorPages[route.path]
                                : curationPages[route.path]
                          }
                        />
                      ))}
                  </Route>
                </Route>
              ),
            )}
            <Route path="*" element={<DevelopmentPage notFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </DemoProvider>
  );
}
