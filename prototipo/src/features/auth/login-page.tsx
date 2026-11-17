import { loginPrefill } from "@/features/demo-studio/studio-rules";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
import { demoConfig } from "@/data/demo-config";

import { returnAfterLogin, isDemoEmail, safeReturnPath } from "./auth-rules";
import { AuthLayout } from "./components/auth-layout";
import { FormField } from "./components/form-field";
import { PasswordField } from "./components/password-field";
export function LoginPage() {
  const { signIn, attempts, user, users } = useDemo();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const prefill = loginPrefill(window.location.href, params.toString(), users);
  const allowedPrefill = !!prefill;
  const [email, setEmail] = useState(allowedPrefill ? (prefill ?? "") : "");
  const [password, setPassword] = useState(
    allowedPrefill ? demoConfig.password : "",
  );
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [message, setMessage] = useState("");
  const [time, setTime] = useState(Date.now);
  const blocked = attempts.blockedUntil > time;
  useEffect(() => {
    if (!attempts.blockedUntil) return;
    const timer = window.setInterval(() => setTime(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [attempts.blockedUntil]);
  const destination = safeReturnPath(params.get("retorno"));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = {
      email: !isDemoEmail(email)
        ? "Use um e-mail de exemplo terminado em @mindshare.test."
        : undefined,
      password: !password ? "Informe a senha de demonstração." : undefined,
    };
    setErrors(nextErrors);
    setMessage("");
    if (nextErrors.email || nextErrors.password) {
      document
        .getElementById(nextErrors.email ? "login-email" : "login-password")
        ?.focus();
      return;
    }
    const result = signIn(email, password);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    navigate(returnAfterLogin(result.user, destination), { replace: true });
  }

  return (
    <AuthLayout>
      <p className="eyebrow">QUE BOM TER VOCÊ POR AQUI</p>
      <h1 tabIndex={-1}>Entre na conversa.</h1>
      <p className="auth-intro">Novas descobertas esperam por você.</p>
      <p className="field-hint">
        Projeto acadêmico. Utilize somente contas fictícias e a senha pública
        demonstracao. Não use sua senha pessoal ou institucional.
      </p>
      {user && (
        <FeedbackMessage>
          Você está como {user.name}.{" "}
          <Link
            to={returnAfterLogin(user, destination)}
            className="inline-link"
          >
            Continuar na demonstração
          </Link>
        </FeedbackMessage>
      )}
      <form noValidate onSubmit={submit} className="auth-form">
        <FormField id="login-email" label="E-mail" error={errors.email}>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="discente@mindshare.test"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="off"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            required
          />
        </FormField>
        <PasswordField
          id="login-password"
          label="Senha"
          value={password}
          onChange={setPassword}
          error={errors.password}
          autoComplete="off"
        />
        {message && <FeedbackMessage error>{message}</FeedbackMessage>}
        {blocked && (
          <p className="field-error" role="status">
            Tente novamente em{" "}
            {Math.min(15, Math.ceil((attempts.blockedUntil - time) / 60000))}{" "}
            min. O bloqueio é apenas demonstrativo.
          </p>
        )}
        <Button type="submit" disabled={blocked} className="full-width">
          Entrar
          <ArrowRight size={17} aria-hidden="true" />
        </Button>
      </form>
      <p className="auth-switch">
        <Link to="/cadastro/professor">Sou Professor · solicitar acesso</Link>
      </p>
      <p className="auth-switch">
        Primeira vez por aqui?{" "}
        <Link
          to={`/cadastro${destination ? `?retorno=${encodeURIComponent(destination)}` : ""}`}
        >
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  );
}
