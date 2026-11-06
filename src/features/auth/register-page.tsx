import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
import {
  validateRegistration,
  safeReturnPath,
  type RegistrationValues,
} from "./auth-rules";
import { AuthLayout } from "./components/auth-layout";
import { FormField } from "./components/form-field";
import { PasswordField } from "./components/password-field";
const initialValues: RegistrationValues = {
  name: "",
  email: "",
  password: "",
  confirmation: "",
  consent: false,
};
export function RegisterPage() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ReturnType<typeof validateRegistration>>(
    {},
  );
  const [consentedAt, setConsentedAt] = useState<string | null>(null);
  const [params] = useSearchParams();
  const destination = safeReturnPath(params.get("retorno"));
  useEffect(() => {
    if (consentedAt) {
      document.title = "Cadastro demonstrativo validado · MindShare";
      document.getElementById("registration-success-title")?.focus();
    }
  }, [consentedAt]);
  const update = <K extends keyof RegistrationValues>(
    key: K,
    value: RegistrationValues[K],
  ) => setValues((previous) => ({ ...previous, [key]: value }));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegistration(values);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.getElementById(`register-${firstError}`)?.focus();
      return;
    }
    setConsentedAt(new Date().toISOString());
    setValues(initialValues);
  }
  return (
    <AuthLayout register>
      {consentedAt ? (
        <div className="registration-success">
          <span className="success-icon">
            <Check size={28} aria-hidden="true" />
          </span>
          <p className="eyebrow">PRIMEIRO PASSO EXPERIMENTADO</p>
          <h1 id="registration-success-title" tabIndex={-1}>
            Tudo certo na demonstração.
          </h1>
          <FeedbackMessage>
            Cadastro de exemplo validado. Nenhuma conta real foi criada.
          </FeedbackMessage>
          <p>
            Seu consentimento foi simulado em{" "}
            {new Date(consentedAt).toLocaleString("pt-BR")}, apenas nesta tela.
            Os campos foram descartados, e nenhuma senha foi armazenada.
          </p>
          <p>
            O acesso à apresentação acontece pelo formulário normal de login.
          </p>
          <Button asChild className="full-width">
            <Link
              to={`/entrar${destination ? `?retorno=${encodeURIComponent(destination)}` : ""}`}
            >
              Ir para o login
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="eyebrow">TEM ESPAÇO PARA A SUA CURIOSIDADE</p>
          <h1 tabIndex={-1}>Comece uma nova troca.</h1>
          <p className="auth-intro">
            Experimente como será fazer parte do MindShare.
          </p>
          <div className="auth-demo-note">
            <strong>Cadastro demonstrativo, sem conta real.</strong>
            <p>
              Preencha com nome e senha fictícios. Use um e-mail terminado em
              @mindshare.test; esse domínio de exemplo não valida vínculo com a
              UFC.
            </p>
          </div>
          <form noValidate onSubmit={submit} className="auth-form">
            <FormField
              id="register-name"
              label="Nome fictício"
              error={errors.name}
            >
              <input
                id="register-name"
                name="name"
                autoComplete="off"
                placeholder="Como podemos chamar seu perfil de exemplo?"
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={
                  errors.name ? "register-name-error" : undefined
                }
                required
              />
            </FormField>
            <FormField
              id="register-email"
              label="E-mail institucional (simulação)"
              error={errors.email}
              hint="Exemplo: estudante@mindshare.test. Domínios oficiais ainda pendentes de confirmação."
            >
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="off"
                placeholder="estudante@mindshare.test"
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={`register-email-hint${errors.email ? " register-email-error" : ""}`}
                required
              />
            </FormField>
            <div className="password-pair">
              <PasswordField
                id="register-password"
                label="Senha de exemplo"
                value={values.password}
                onChange={(value) => update("password", value)}
                error={errors.password}
                hint="Pelo menos 8 caracteres. Não use uma senha real."
                autoComplete="off"
              />
              <PasswordField
                id="register-confirmation"
                label="Confirmar senha"
                value={values.confirmation}
                onChange={(value) => update("confirmation", value)}
                error={errors.confirmation}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="checkbox-field consent-field">
                <input
                  id="register-consent"
                  type="checkbox"
                  checked={values.consent}
                  onChange={(event) => update("consent", event.target.checked)}
                  aria-invalid={!!errors.consent}
                  aria-describedby={`consent-description${errors.consent ? " register-consent-error" : ""}`}
                />
                <span>
                  Concordo em simular o consentimento para tratamento dos dados
                  fictícios desta demonstração.
                </span>
              </label>
              <p id="consent-description" className="field-hint">
                O consentimento e sua data ficam apenas em memória. Os dados
                digitados não são enviados a um servidor nem salvos no
                navegador.
              </p>
              {errors.consent && (
                <p className="field-error" id="register-consent-error">
                  {errors.consent}
                </p>
              )}
            </div>
            <Button type="submit" className="full-width">
              Experimentar cadastro
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
          </form>
          <p className="auth-switch">
            Já conhece a demonstração?{" "}
            <Link
              to={`/entrar${destination ? `?retorno=${encodeURIComponent(destination)}` : ""}`}
            >
              Entrar com perfil de exemplo
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
