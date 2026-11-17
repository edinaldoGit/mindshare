import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Info } from "lucide-react";
import type { Activity } from "@/types/domain";
import { useDemo } from "@/app/providers/demo-context";
import { availableSeats } from "@/features/catalog/catalog-selectors";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
export function EnrollmentAction({ activity }: { activity: Activity }) {
  const { user, enrollments, enroll } = useDemo();
  const followLink = useRef<HTMLAnchorElement>(null);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const existing = user
    ? enrollments.find(
        (item) =>
          item.participantId === user.id && item.activityId === activity.id,
      )
    : undefined;
  const available = availableSeats(activity, enrollments);
  useEffect(() => { if (feedback?.ok) followLink.current?.focus({ preventScroll: true }); }, [feedback]);
  if (user?.kind === "Professor Curador")
    return (
      <div className="next-stage-message" role="status">
        <Info size={18} aria-hidden="true" />
        <p>
          A inscrição é uma jornada dos discentes. Você está na sessão de
          Professor Curador.
        </p>
      </div>
    );
  if (existing)
    return (
      <div className="existing-enrollment">
        {feedback && (
          <FeedbackMessage error={!feedback.ok}>
            {feedback.message}
          </FeedbackMessage>
        )}
        <p>
          <Check size={17} aria-hidden="true" />
          {existing.status === "Concluída"
            ? "Você já concluiu esta atividade."
            : "Você já está inscrito nesta atividade."}
        </p>
        <Button asChild className="full-width" variant="outline">
          <Link ref={followLink} to={`/participante/atividades/${activity.id}`}>
            Acompanhar atividade
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </Button>
      </div>
    );
  if (available === 0)
    return (
      <>
        <Button disabled className="full-width">
          Vagas esgotadas
        </Button>
        <p className="enrollment-help" role="status">
          As vagas desta atividade se esgotaram. Explore outras atividades no
          catálogo.
        </p>
      </>
    );
  if (!user)
    return (
      <>
        <Button asChild className="full-width">
          <Link
            to={`/entrar?retorno=${encodeURIComponent(`/atividades/${activity.id}`)}`}
          >
            Entrar para participar
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </Button>
        <p className="enrollment-help">
          Entre com um perfil fictício para confirmar sua inscrição.
        </p>
      </>
    );
  return (
    <>
      {feedback && (
        <FeedbackMessage error={!feedback.ok}>
          {feedback.message}
        </FeedbackMessage>
      )}
      <Button
        className="full-width"
        onClick={() => setFeedback(enroll(activity.id))}
      >
        Confirmar inscrição
        <ArrowUpRight size={16} aria-hidden="true" />
      </Button>
      <p className="enrollment-help">
        Inscrição somente no ambiente de demonstração.
      </p>
    </>
  );
}
