import { useState, type ReactNode } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { LogOut, RotateCcw, type LucideIcon } from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { ConfirmationDialog } from "@/components/feedback/confirmation-dialog";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
import { brand } from "@/lib/brand";

export type WorkspaceLink = { path: string; label: string; icon: LucideIcon };
export function WorkspaceFrame({
  links,
  identity,
  navigationLabel,
  mobileLabel,
  aside,
  footnote,
  className = "",
}: {
  links: WorkspaceLink[];
  identity: string;
  navigationLabel: string;
  mobileLabel: string;
  aside: ReactNode;
  footnote: string;
  className?: string;
}) {
  const { user, resetDemo, signOut } = useDemo();
  const location = useLocation();
  const navigate = useNavigate();
  const [resetOpen, setResetOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [revision, setRevision] = useState(0);
  const current =
    links.find((item) => item.path === location.pathname)?.path ??
    links[1].path;
  return (
    <div className={`instructor-shell ${className}`}>
      <aside className="instructor-sidebar">
        <div className="instructor-identity">
          <img src={brand.icon} alt="" />
          <div>
            <span className="eyebrow">MEU ESPAÇO</span>
            <p>{user?.name}</p>
            <small>{identity}</small>
          </div>
        </div>
        <nav aria-label={navigationLabel}>
          {links.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} end>
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="instructor-sidebar-extra">
          {aside}
          <Link to="/catalogo">Explorar catálogo</Link>
          <button
            type="button"
            className="workspace-signout"
            onClick={() => {
              signOut();
              navigate("/");
            }}
          >
            <LogOut size={14} aria-hidden="true" />
            Sair da demonstração
          </button>
        </div>
        <span className="sidebar-footnote">{footnote}</span>
      </aside>
      <div className="instructor-main">
        <div className="instructor-mobile-navigation">
          <label htmlFor="workspace-destination">{mobileLabel}</label>
          <select
            id="workspace-destination"
            value={current}
            onChange={(event) => navigate(event.target.value)}
          >
            {links.map((item) => (
              <option key={item.path} value={item.path}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        {message && <FeedbackMessage>{message}</FeedbackMessage>}
        <Outlet key={revision} />
        <div className="instructor-demo-tools">
          <span>Ambiente demonstrativo · dados fictícios neste navegador.</span>
          <button type="button" onClick={() => setResetOpen(true)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reiniciar demonstração
          </button>
        </div>
      </div>
      <ConfirmationDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          resetDemo();
          setRevision((value) => value + 1);
          setMessage(
            "Exemplos iniciais restaurados. Propostas, decisões e inscrições foram atualizadas. Sua sessão foi mantida.",
          );
        }}
      />
    </div>
  );
}
