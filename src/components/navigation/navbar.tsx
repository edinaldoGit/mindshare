import { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/common/brand";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/app/providers/demo-context";
import { homeForUser } from "@/features/auth/auth-rules";
export function Navbar() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const { user, signOut } = useDemo();
  const navigate = useNavigate();
  const close = () => setOpen(false);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          close();
          trigger.current?.focus();
        }
      }}
    >
      <div className="container header-content">
        <Brand />
        <button
          type="button"
          ref={trigger}
          className="mobile-menu-toggle icon-button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="public-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        <div
          id="public-navigation"
          className={`public-navigation ${open ? "is-open" : ""}`}
        >
          <nav aria-label="Navegação principal" onClick={close}>
            <NavLink to="/" end>
              Início
            </NavLink>
            <NavLink to="/catalogo">Explorar atividades</NavLink>
            {user?.kind === "Discente" && (
              <NavLink to="/instrutor">Quero ensinar</NavLink>
            )}
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <Link
                  to={homeForUser(user)}
                  onClick={close}
                  className="session-link"
                >
                  <span className="avatar" aria-hidden="true">
                    {user.name.charAt(0)}
                  </span>
                  <span>
                    {user.name.split(" ")[0]}
                    <small>Meu espaço</small>
                  </span>
                </Link>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Sair da demonstração"
                  onClick={() => {
                    signOut();
                    close();
                    navigate("/");
                  }}
                >
                  <LogOut size={18} aria-hidden="true" />
                </button>
              </>
            ) : (
              <>
                <NavLink to="/entrar" className="login-link" onClick={close}>
                  Entrar
                </NavLink>
                <Button asChild>
                  <Link to="/cadastro" onClick={close}>
                    Começar agora
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
