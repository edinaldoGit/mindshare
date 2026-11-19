import { Link } from "react-router-dom";
import { Activity, ClipboardList, LayoutGrid, Plus } from "lucide-react";
import { WorkspaceFrame } from "@/components/layout/workspace-frame";
const links = [
  { path: "/instrutor", label: "Visão geral", icon: LayoutGrid },
  {
    path: "/instrutor/propostas",
    label: "Minhas propostas",
    icon: ClipboardList,
  },
  { path: "/instrutor/propostas/nova", label: "Nova proposta", icon: Plus },
  { path: "/instrutor/atividades", label: "Minhas atividades", icon: Activity },
];
export function InstructorLayout() {
  return (
    <WorkspaceFrame
      links={links}
      identity="Discente · Instrutor"
      navigationLabel="Área do Instrutor"
      mobileLabel="Meu espaço de ensino"
      headerExtra={
        <div
          className="context-switcher"
          role="group"
          aria-label="Alternar papel discente"
        >
          <Link to="/participante">Participante</Link>
          <Link to="/instrutor" aria-current="page">
            Instrutor
          </Link>
        </div>
      }
      footnote="Propostas e atividades em um só lugar."
      aside={
        <>
          <p>Ensinar também é aprender.</p>
          <Link to="/participante">Mudar para Participante</Link>
        </>
      }
    />
  );
}
