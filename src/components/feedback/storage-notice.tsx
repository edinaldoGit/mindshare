import { useDemo } from "@/app/providers/demo-context";
import { FeedbackMessage } from "./feedback-message";
export function StorageNotice() {
  const { storageNotice } = useDemo();
  const isError = /não foi possível|indisponível|inválidos|falhou/i.test(storageNotice);
  return storageNotice ? (
    <div className="storage-notice">
      <FeedbackMessage error={isError}>{storageNotice}</FeedbackMessage>
    </div>
  ) : null;
}
