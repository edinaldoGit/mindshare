import { CurationLayout } from "@/features/curation/curation-layout";
import { ParticipantLayout } from "@/features/participant/participant-layout";
import { InstructorLayout } from "@/features/instructor/instructor-layout";
import { NavLink, Outlet } from "react-router-dom";
import {
  areaLabels,
  plannedRoutes,
  type PlannedRoute,
} from "@/app/routes/route-config";
export function WorkspaceLayout({ area }: { area: PlannedRoute["area"] }) {
  if (area === "participant") return <ParticipantLayout />;
  if (area === "instructor") return <InstructorLayout />;
  if (area === "curation") return <CurationLayout />;
  return (
    <div className="workspace">
      <aside>
        <p className="eyebrow">{areaLabels[area]}</p>
        <nav aria-label={`Navegação de ${areaLabels[area]}`}>
          {plannedRoutes
            .filter((route) => route.area === area && !route.path.includes(":"))
            .map((route) => (
              <NavLink key={route.path} to={route.path} end>
                {route.title}
              </NavLink>
            ))}
        </nav>
        <p className="text-sm text-muted-foreground">
          Área em preparação. Você está em uma sessão demonstrativa.
        </p>
      </aside>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
