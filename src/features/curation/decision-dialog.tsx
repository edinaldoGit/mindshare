import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CheckCheck, MessageSquareText, X } from "lucide-react";
import type { Activity, CurationDecision } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
export type DecisionKind = CurationDecision["outcome"];
const copy = {
  Aprovada: {
    title: "Aprovar esta proposta?",
    description:
      "Após a aprovação, a atividade ficará disponível no catálogo do MindShare e poderá receber inscrições.",
    label: "",
    action: "Confirmar aprovação",
    icon: CheckCheck,
  },
  Rejeitada: {
    title: "Rejeitar esta proposta?",
    description:
      "Explique o motivo da decisão. A justificativa ficará disponível para o Instrutor, e a proposta não será publicada.",
    label: "Justificativa da rejeição",
    action: "Confirmar rejeição",
    icon: X,
  },
  "Ajustes solicitados": {
    title: "Quais ajustes são necessários?",
    description:
      "Explique o que o Instrutor precisa revisar antes de reenviar. Sua solicitação ficará registrada no histórico.",
    label: "Descrição dos ajustes",
    action: "Enviar solicitação",
    icon: MessageSquareText,
  },
};
export function DecisionDialog({
  activity,
  kind,
  onClose,
  onDecide,
}: {
  activity: Activity;
  kind: DecisionKind;
  onClose: () => void;
  onDecide: (reason: string) => { ok: boolean; message: string };
}) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const lock = useRef(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const text = copy[kind],
    Icon = text.icon;
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => {
      if (element?.open) element.close();
    };
  }, []);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    if (kind !== "Aprovada" && !reason.trim()) {
      setFieldError(
        kind === "Rejeitada"
          ? "Informe a justificativa da rejeição."
          : "Descreva os ajustes necessários.",
      );
      field.current?.focus();
      return;
    }
    lock.current = true;
    const result = onDecide(reason);
    if (result.ok) {
      dialog.current?.close();
      onClose();
    } else {
      setError(result.message);
      lock.current = false;
    }
  }
  return (
    <dialog
      ref={dialog}
      className="confirmation-dialog curation-decision-dialog"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => {
        event.preventDefault();
        dialog.current?.close();
        onClose();
      }}
    >
      <form onSubmit={submit} noValidate>
        <span className="reset-dialog-icon">
          <Icon size={23} aria-hidden="true" />
        </span>
        <p className="eyebrow">DECISÃO DE CURADORIA</p>
        <h2 id={`${id}-title`}>{text.title}</h2>
        <p className="decision-proposal-title">{activity.title}</p>
        <p id={`${id}-description`}>{text.description}</p>
        {kind !== "Aprovada" && (
          <label className="instructor-field" htmlFor={`${id}-reason`}>
            {text.label}
            <textarea
              ref={field}
              id={`${id}-reason`}
              rows={5}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
              aria-invalid={!!fieldError}
              aria-describedby={fieldError ? `${id}-error` : undefined}
            />
            {fieldError && (
              <span id={`${id}-error`} className="field-error" role="alert">
                {fieldError}
              </span>
            )}
          </label>
        )}
        {error && <FeedbackMessage error>{error}</FeedbackMessage>}
        <div className="dialog-actions">
          <Button
            type="button"
            variant="outline"
            autoFocus
            onClick={() => {
              dialog.current?.close();
              onClose();
            }}
          >
            Continuar lendo
          </Button>
          <Button
            type="submit"
            className={kind === "Rejeitada" ? "decision-reject" : ""}
          >
            {text.action}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
