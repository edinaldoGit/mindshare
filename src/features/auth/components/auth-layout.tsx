import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { brand } from "@/lib/brand";
export function AuthLayout({
  children,
  register = false,
}: {
  children: ReactNode;
  register?: boolean;
}) {
  const [imageUnavailable, setImageUnavailable] = useState(false);
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
                <br /> <span>compartilha.</span>
              </>
            )}
          </p>
          <p className="auth-story-description">
            Um espaço de troca entre estudantes, feito para transformar
            curiosidade em conhecimento.
          </p>
        </div>
        {!imageUnavailable && (
          <div className="auth-art auth-landscape" aria-hidden="true">
            <img
              src={
                register ? brand.registerIllustration : brand.loginIllustration
              }
              alt=""
              width="1122"
              height="1402"
              decoding="async"
              onError={() => setImageUnavailable(true)}
            />
          </div>
        )}
        <p className="auth-story-foot">UFC QUIXADÁ · PROTÓTIPO ACADÊMICO</p>
      </aside>
      <section className="auth-form-panel">{children}</section>
    </div>
  );
}
