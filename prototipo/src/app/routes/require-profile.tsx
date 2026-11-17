import { Navigate, Outlet, useLocation, Link } from "react-router-dom";
import { useDemo } from "@/app/providers/demo-context";
import { canAccessArea, homeForUser } from "@/features/auth/auth-rules";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
export function RequireProfile({
  area,
}: {
  area: "participant" | "instructor" | "curation" | "administration";
}) {
  const { user } = useDemo();
  const location = useLocation();
  if (!user)
    return (
      <Navigate
        to={`/entrar?retorno=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  if (!canAccessArea(user, area))
    return (
      <section className="development-page">
        <ShieldCheck aria-hidden="true" />
        <p className="eyebrow">PERFIS DA DEMONSTRAÇÃO</p>
        <h1 tabIndex={-1}>Este espaço é de outro perfil.</h1>
        <p>
          {user.kind === "Discente"
            ? "A curadoria está disponível apenas para o Professor Curador."
            : "As áreas de participação e criação de propostas são destinadas aos discentes."}
        </p>
        <Button asChild>
          <Link to={homeForUser(user)}>Voltar ao meu espaço</Link>
        </Button>
      </section>
    );
  return <Outlet />;
}
