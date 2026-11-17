import type { ReactNode } from "react";
import { BookOpen, Users, ArrowUpRight } from "lucide-react";

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
        <p className="eyebrow">CONEXÕES QUE ENSINAM</p>
        <p className="auth-story-title">
          {register ? (
            <>
              Novas conexões.
              <br />
              <span>Novas possibilidades.</span>
            </>
          ) : (
            <>
              O conhecimento
              <br />
              cresce quando
              <br />
              <span>é compartilhado.</span>
            </>
          )}
        </p>
        <p className="auth-story-description">
          Aprenda, compartilhe e descubra com a comunidade universitária.
        </p>
        <div className="auth-connections" aria-hidden="true">
          <span>
            <BookOpen size={25} strokeWidth={1.5} />
          </span>
          <i />
          <span>
            <Users size={25} strokeWidth={1.5} />
          </span>
          <i />
          <span>
            <ArrowUpRight size={25} strokeWidth={1.5} />
          </span>
        </div>
        <p className="auth-story-foot">Uma boa troca abre novos caminhos.</p>
      </aside>
      <section className="auth-form-panel">{children}</section>
    </div>
  );
}
