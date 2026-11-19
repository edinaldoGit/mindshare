import {
  NavLink,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutGrid,
  BookOpen,
  Clock3,
  FileText,
  Compass,
  ArrowUpRight,
} from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { brand } from "@/lib/brand";
const navigation = [
  { path: "/participante", label: "Visão geral", icon: LayoutGrid },
  {
    path: "/participante/inscricoes",
    label: "Minhas inscrições",
    icon: BookOpen,
  },
  {
    path: "/participante/historico",
    label: "Histórico de horas",
    icon: Clock3,
  },
  { path: "/participante/comprovantes", label: "Comprovantes", icon: FileText },
  {
    path: "/participante/recomendacoes",
    label: "Descobrir por interesse",
    icon: Compass,
  },
];
export function ParticipantLayout() {
  const { user } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const current =
    navigation.find((item) => item.path === location.pathname)?.path ??
    "/participante/inscricoes";
  return (
    <div className="participant-shell">
      <aside className="participant-sidebar">
        <div className="participant-identity">
          <img src={brand.icon} alt="" width="477" height="407" />
          <div>
            <span className="eyebrow">MEU ESPAÇO</span>
            <p>{user?.name}</p>
            <small>Discente</small>
          </div>
        </div>
        <nav aria-label="Área do participante">
          {navigation.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} end>
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="participant-sidebar-extra">
          <p>
            O conhecimento vai
            <br />
            nos dois sentidos.
          </p>
          <Link to="/instrutor">
            Minha área de Instrutor
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <Link to="/catalogo">
            Explorar catálogo
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <span className="sidebar-footnote">
          Seu aprendizado, em um só lugar.
        </span>
      </aside>
      <div className="participant-main">
        <div className="participant-mobile-navigation">
          <label htmlFor="participant-destination">
            Meu espaço de aprendizagem
          </label>
          <select
            id="participant-destination"
            value={current}
            onChange={(event) => navigate(event.target.value)}
          >
            {navigation.map((item) => (
              <option key={item.path} value={item.path}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
