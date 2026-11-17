import { ClipboardList, History, LayoutGrid } from "lucide-react";
import { WorkspaceFrame } from "@/components/layout/workspace-frame";
const links = [
  { path: "/curadoria", label: "Visão geral", icon: LayoutGrid },
  {
    path: "/curadoria/propostas",
    label: "Fila de propostas",
    icon: ClipboardList,
  },
  {
    path: "/curadoria/historico",
    label: "Histórico de decisões",
    icon: History,
  },
];
export function CurationLayout() {
  return (
    <WorkspaceFrame
      className="curation-shell"
      links={links}
      identity="Professor Curador · Demonstração"
      navigationLabel="Área de Curadoria"
      mobileLabel="Meu espaço de curadoria"
      footnote="Uma leitura atenta abre novos caminhos."
      aside={<p>Conhecimento que merece circular.</p>}
    />
  );
}
