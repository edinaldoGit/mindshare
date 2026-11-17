import { Outlet, useLocation } from "react-router-dom";
import { RouteFocus } from "@/components/feedback/route-focus";
import { Navbar } from "@/components/navigation/navbar";
import { StorageNotice } from "@/components/feedback/storage-notice";
import { Footer } from "@/components/navigation/footer";
export function PublicLayout() {
  const { pathname } = useLocation();
  const isAuthPage = ["/entrar", "/cadastro", "/cadastro/professor"].includes(
    pathname,
  );
  return (
    <>
      <button
        type="button"
        className="skip-link"
        onClick={() => document.getElementById("conteudo")?.focus()}
      >
        Pular para o conteúdo
      </button>
      <Navbar />
      <main id="conteudo" tabIndex={-1} className="container">
        <StorageNotice />
        <Outlet />
      </main>
      {isAuthPage ? (
        <footer className="auth-footer container">
          Protótipo acadêmico · Pessoas e atividades fictícias. Não é um serviço
          oficial da UFC.
        </footer>
      ) : (
        <Footer />
      )}
      <RouteFocus />
    </>
  );
}
