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
            Sua solicitação será analisada pela Administração. Após a aprovação,
            acesse a plataforma pelo formulário de login com o e-mail informado.
          </p>
          <Button asChild>
            <Link to="/entrar">Ir para o login</Link>
          </Button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={submit}>
          <label className="instructor-field">
            Nome completo
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="instructor-field">
            E-mail institucional
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
              <option value="Administrativa">Análise administrativa</option>
              <option value="Institucional simulada">
                Verificação institucional
              </option>
            </select>
          </label>
          {method === "Administrativa" ? (
            <div className="learning-card">
              <h2>Comprovação de vínculo docente</h2>
              <p>
                A solicitação será encaminhada para análise da equipe
                administrativa, com acesso restrito aos dados necessários para
                confirmação do vínculo docente.
              </p>
            </div>
          ) : (
            <div className="learning-card">
              <h2>Consulta institucional</h2>
              <p>
                Validação automática mediante confirmação de identidade e
                vínculo docente ativo em fonte institucional confiável.
              </p>
              <label className="instructor-field">
                Resultado da verificação
                <select
                  value={positive ? "positive" : "negative"}
                  onChange={(e) => setPositive(e.target.value === "positive")}
                >
                  <option value="negative">
                    Vínculo docente ativo não confirmado
                  </option>
                  <option value="positive">
                    Identidade e vínculo docente ativo confirmados
                  </option>
                </select>
              </label>
            </div>
          )}
          <p className="field-hint">
            Os dados informados serão utilizados exclusivamente para análise e
            validação do perfil de Professor Curador, com acesso restrito à
            Administração, conforme a LGPD.
          </p>
          <label className="consent-label">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />{" "}
            Li e concordo com o tratamento dos dados desta solicitação.
          </label>
          {result && !result.ok && (
            <FeedbackMessage error>{result.message}</FeedbackMessage>
          )}
          <Button type="submit">
            {method === "Administrativa"
              ? "Enviar solicitação"
              : "Consultar vínculo institucional"}
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
