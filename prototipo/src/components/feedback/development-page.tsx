import { ArrowLeft, Construction } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
export function DevelopmentPage({
  title = "Página não encontrada",
  notFound = false,
}: {
  title?: string;
  notFound?: boolean;
}) {
  return (
    <section className="development-page">
      <Construction size={32} aria-hidden="true" className="text-primary" />
      <p className="eyebrow">
        {notFound ? "Endereço indisponível" : "Recurso indisponível"}
      </p>
      <h1 tabIndex={-1}>{title}</h1>
      <p>
        {notFound
          ? "Este endereço não corresponde a uma página do MindShare."
          : "Este recurso não está disponível no momento."}
      </p>
      <Button asChild variant="outline">
        <Link to="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Voltar ao início
        </Link>
      </Button>
    </section>
  );
}
