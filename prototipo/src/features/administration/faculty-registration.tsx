import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
import { useDemo } from "@/app/providers/demo-context";
import { requestFaculty } from "@/lib/demo/evolution";
export function FacultyRegistration() {
  const { run } = useDemo();
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [department, setDepartment] = useState(""),
    [method, setMethod] = useState<"Administrativa" | "Institucional simulada">(
      "Administrativa",
    ),
    [positive, setPositive] = useState(false),
    [consent, setConsent] = useState(false),
    [result, setResult] = useState<{ ok: boolean; message: string } | null>(
      null,
    );
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!consent) {
      setResult({
        ok: false,
        message:
          "Leia e aceite o aviso de tratamento da solicitação para continuar.",
      });
      return;
    }
    setResult(
      run((s) =>
        requestFaculty(
          s,
          {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            department: department.trim(),
            method,
          },
          new Date().toISOString(),
          crypto.randomUUID(),
          positive,
        ),
      ),
    );
  }
  return (
    <AuthLayout register>
      <p className="eyebrow">DOCÊNCIA QUE CONECTA</p>
      <h1>Faça parte da curadoria.</h1>
      <p className="auth-intro">
        Solicite acesso para orientar as próximas trocas de conhecimento.
      </p>
      {result?.ok ? (
        <div className="learning-card">
          <h2>Solicitação registrada</h2>
          <FeedbackMessage>{result.message}</FeedbackMessage>
          <p>
            Consulte o resultado pelo Administrador. Após aprovação, acesse com
            o e-mail informado e a senha pública de apresentação: demonstracao.
          </p>
          <Button asChild>
            <Link to="/entrar">Ir para o login</Link>
          </Button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          <label className="instructor-field">
            Nome fictício
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="instructor-field">
            E-mail de apresentação
            <input
              type="email"
              required
              placeholder="professor@mindshare.test"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="instructor-field">
            Unidade e vínculo declarado
            <input
              required
              placeholder="Computação · UFC Quixadá"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </label>
          <label className="instructor-field">
            Forma de verificação
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as typeof method)}
            >
              <option>Administrativa</option>
              <option>Institucional simulada</option>
            </select>
          </label>
          {method === "Administrativa" ? (
            <div className="learning-card">
              <h2>Documentação de exemplo</h2>
              <p>
                Será anexada uma representação inteiramente fictícia de
                declaração de vínculo. Nenhum arquivo pessoal é coletado ou
                transmitido.
              </p>
            </div>
          ) : (
            <div className="learning-card">
              <h2>Consulta institucional demonstrativa</h2>
              <p>
                Este fluxo representa identificação e consulta a uma fonte
                confiável. Não consulta UFC, SIAPE ou gov.br. Esses
                identificadores isolados não concedem acesso.
              </p>
              <label className="instructor-field">
                Cenário da fonte simulada
                <select
                  value={positive ? "positive" : "negative"}
                  onChange={(e) => setPositive(e.target.value === "positive")}
                >
                  <option value="negative">
                    Identidade ou vínculo ativo não confirmado
                  </option>
                  <option value="positive">
                    Identidade e vínculo ativo confirmados pela fonte fictícia
                  </option>
                </select>
              </label>
            </div>
          )}
          <p className="field-hint">
            Dados desta solicitação ficam neste navegador para análise pelo
            perfil administrativo. Restaurar os cenários remove esses dados
            locais. Utilize somente dados fictícios. Em um serviço real,
            finalidade, base legal, prazo de retenção e canal de direitos seriam
            informados antes da coleta.
          </p>
          <label className="consent-label">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />{" "}
            Li o aviso e usarei somente dados fictícios nesta solicitação.
          </label>
          {result && !result.ok && (
            <FeedbackMessage error>{result.message}</FeedbackMessage>
          )}
          <Button type="submit">
            {method === "Administrativa"
              ? "Enviar solicitação"
              : "Identificar e consultar fonte simulada"}
          </Button>
        </form>
      )}
      <p className="auth-switch">
        <Link to="/cadastro">Sou Discente</Link> ·{" "}
        <Link to="/entrar">Já tenho acesso</Link>
      </p>
    </AuthLayout>
  );
}
