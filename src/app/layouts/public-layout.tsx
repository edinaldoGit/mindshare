import { Outlet } from "react-router-dom";
import { RouteFocus } from "@/components/feedback/route-focus";
import { Navbar } from "@/components/navigation/navbar";
import { StorageNotice } from "@/components/feedback/storage-notice";
import { Footer } from "@/components/navigation/footer";
export function PublicLayout() {
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
      <Footer />
      <RouteFocus />
    </>
  );
}
