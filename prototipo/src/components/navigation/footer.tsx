import { Link } from "react-router-dom";
import { brand } from "@/lib/brand";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" aria-label="MindShare, início">
              <img src={brand.logo} alt="MindShare" width="1029" height="222" />
            </Link>
            <p>
              Conhecimento que conecta.
              <br />
              De estudante para estudante.
            </p>
          </div>
          <nav aria-label="Navegação do rodapé">
            <Link to="/">Início</Link>
            <Link to="/catalogo">Catálogo de atividades</Link>
            <Link to="/entrar">Entrar</Link>
          </nav>
          <div className="footer-context">
            <span className="eyebrow">FEITO PARA APRENDER JUNTOS</span>
            <p>
              Projeto acadêmico
              <br />
              UFC · Campus de Quixadá
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>Protótipo acadêmico · Pessoas e atividades fictícias.</span>
          <span>Não é um serviço oficial da UFC.</span>
        </div>
        <p className="institution-note">
          A aprovação de atividades e a emissão de comprovantes não garantem o
          reconhecimento da carga horária pela UFC.
        </p>
      </div>
    </footer>
  );
}
