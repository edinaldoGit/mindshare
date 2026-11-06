import { useEffect, useRef, useId } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
export function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = "Voltar ao ponto de partida?",
  description = "As propostas, decisões e inscrições desta demonstração serão substituídas pelos exemplos iniciais. O histórico e os comprovantes acompanharão essa mudança. Sua sessão será mantida, e nenhum dado externo será afetado.",
  confirmLabel = "Restaurar exemplos iniciais",
  cancelLabel = "Manter meus dados",
  eyebrow = "RECURSO DE DEMONSTRAÇÃO",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  eyebrow?: string;
}) {
  const titleId = useId(),
    descriptionId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    else if (!open && dialog.current?.open) dialog.current.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="confirmation-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        dialog.current?.close();
        onClose();
      }}
    >
      <span className="reset-dialog-icon">
        <RotateCcw size={23} aria-hidden="true" />
      </span>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={titleId}>{title}</h2>
      <p id={descriptionId}>{description}</p>
      <div className="dialog-actions">
        <Button variant="outline" autoFocus onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
