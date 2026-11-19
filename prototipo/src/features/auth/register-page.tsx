import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
import { useDemo } from "@/app/providers/demo-context";
import { registerStudent } from "@/lib/demo/evolution";
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
  const { run } = useDemo();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ReturnType<typeof validateRegistration>>(
    {},
  );
  const [submitError, setSubmitError] = useState("");
  const [createdEmail, setCreatedEmail] = useState("");
  const [consentedAt, setConsentedAt] = useState<string | null>(null);
  const [params] = useSearchParams();
  const destination = safeReturnPath(params.get("retorno"));
  useEffect(() => {
    if (consentedAt) {
      document.title = "Cadastro concluído · MindShare";
      document.getElementById("registration-success-title")?.focus();
    }
  }, [consentedAt]);
  const update = <K extends keyof RegistrationValues>(
    key: K,
    value: RegistrationValues[K],
  ) => setValues((previous) => ({ ...previous, [key]: value }));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    const nextErrors = validateRegistration(values);
    setErrors(nextErrors);
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.getElementById(`register-${firstError}`)?.focus();
      return;
    }
    const now = new Date().toISOString();
    const email = values.email.trim().toLowerCase();
    const res = run((s) =>
      registerStudent(
        s,
        { name: values.name, email },
        now,
        crypto.randomUUID(),
      ),
    );
    if (!res.ok) {
      setSubmitError(res.message);
      return;
    }
    setCreatedEmail(email);
    setConsentedAt(now);
    setValues(initialValues);
  }
  return (
    <AuthLayout register>
      {consentedAt ? (
        <div className="registration-success">
          <span className="success-icon">
            <Check size={28} aria-hidden="true" />
          </span>
          <p className="eyebrow">BEM-VINDO AO MINDSHARE</p>
          <h1 id="registration-success-title" tabIndex={-1}>
            Cadastro concluído.
          </h1>
          <FeedbackMessage>
            Conta criada com sucesso para {createdEmail}.
          </FeedbackMessage>
          <p>
            Consentimento registrado em{" "}
            {new Date(consentedAt).toLocaleString("pt-BR")}.
          </p>
          <p>
            Acesse a plataforma utilizando <strong>{createdEmail}</strong> no
            formulário de login.
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
            Crie sua conta discente para participar e compartilhar conhecimento
            na UFC Quixadá.
          </p>
          {submitError && <FeedbackMessage error>{submitError}</FeedbackMessage>}
          <form noValidate onSubmit={submit} className="auth-form">
            <FormField
              id="register-name"
              label="Nome completo"
              error={errors.name}
            >
              <input
                id="register-name"
                name="name"
                autoComplete="name"
                placeholder="Como você gostaria de ser chamado?"
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
              label="E-mail institucional"
              error={errors.email}
              hint="Utilize seu endereço institucional (@mindshare.test)."
            >
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
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
                label="Senha"
                value={values.password}
                onChange={(value) => update("password", value)}
                error={errors.password}
                hint="Pelo menos 8 caracteres."
                autoComplete="new-password"
              />
              <PasswordField
                id="register-confirmation"
                label="Confirmar senha"
                value={values.confirmation}
                onChange={(value) => update("confirmation", value)}
                error={errors.confirmation}
                autoComplete="new-password"
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
                  Concordo com o tratamento dos meus dados pessoais para uso da
                  plataforma MindShare, conforme a LGPD.
                </span>
              </label>
              <p id="consent-description" className="field-hint">
                Seus dados serão utilizados exclusivamente para identificação,
                inscrições, registro de carga horária e emissão de comprovantes.
              </p>
              {errors.consent && (
                <p className="field-error" id="register-consent-error">
                  {errors.consent}
                </p>
              )}
            </div>
            <Button type="submit" className="full-width">
              Criar conta
              <ArrowRight size={17} aria-hidden="true" />
            </Button>
          </form>
          <p className="auth-switch">
            Já possui uma conta?{" "}
            <Link
              to={`/entrar${destination ? `?retorno=${encodeURIComponent(destination)}` : ""}`}
            >
              Entrar
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
}
