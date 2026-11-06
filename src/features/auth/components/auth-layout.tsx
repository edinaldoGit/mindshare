import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { brand } from "@/lib/brand";
export function AuthLayout({
  children,
  register = false,
}: {
  children: ReactNode;
  register?: boolean;
}) {
  return (
    <div className={`auth-layout ${register ? "auth-register" : ""}`}>
      <aside className="auth-story">
        <Link to="/" className="auth-logo">
          <img
            src={brand.logo}
            alt="MindShare, início"
            width="1029"
            height="222"
          />
        </Link>
        <div>
          <p className="eyebrow">CONEXÕES QUE ENSINAM</p>
          <p className="auth-story-title">
            {register ? (
              <>
                Seu conhecimento.
                <br />
                Novas possibilidades.
              </>
            ) : (
              <>
                Aprender é melhor
                <br />
                quando a gente
                <br />{" "}
                <span>compartilha.</span>
              </>
            )}
          </p>
          <p className="auth-story-description">
            Um espaço de troca entre estudantes, feito para transformar
            curiosidade em conhecimento.
          </p>
        </div>
        <div className="auth-art" aria-hidden="true">
          <span className="auth-circle circle-one" />
          <span className="auth-circle circle-two" />
          <span className="auth-art-symbol">
            <img src={brand.icon} alt="" width="477" height="407" />
          </span>
          <span className="auth-art-note">
            Ideias que encontram
            <br />
            <strong>outros caminhos.</strong>
            <ArrowUpRight size={20} />
          </span>
        </div>
        <p className="auth-story-foot">UFC QUIXADÁ · PROTÓTIPO ACADÊMICO</p>
      </aside>
      <section className="auth-form-panel">{children}</section>
    </div>
  );
}
