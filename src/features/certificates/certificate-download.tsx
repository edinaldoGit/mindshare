import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";
export function CertificateDownload({
  enrollmentId,
  activityTitle,
}: {
  enrollmentId: string;
  activityTitle: string;
}) {
  const { state, users, user } = useDemo();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const inFlight = useRef(false);
  const downloadButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!busy && message) downloadButton.current?.focus({ preventScroll: true }); }, [busy, message]);
  async function download() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      const [{ generateCertificatePdf }, response] = await Promise.all([
        import("./certificate-pdf"),
        fetch(brand.logo),
      ]);
      if (!response.ok) throw new Error("Marca indisponível");
      const bytes = await generateCertificatePdf(
        state,
        users,
        user,
        enrollmentId,
        { logoBytes: new Uint8Array(await response.arrayBuffer()) },
      );
      const blob = new Blob([new Uint8Array(bytes).buffer], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mindshare-comprovante-${state.enrollments.find((item) => item.id === enrollmentId)?.activityId ?? "demonstrativo"}.pdf`;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30000);
      setMessage(
        "PDF demonstrativo preparado. O download foi solicitado ao navegador.",
      );
    } catch {
      setFailed(true);
      setMessage("Não foi possível gerar o comprovante. Tente novamente.");
    } finally {
      setBusy(false);
      inFlight.current = false;
    }
  }
  return (
    <div className="certificate-download">
      <Button
        ref={downloadButton}
        variant="outline"
        disabled={busy}
        onClick={download}
        aria-label={`Baixar comprovante: ${activityTitle}`}
      >
        <Download size={16} aria-hidden="true" />
        {busy ? "Preparando PDF…" : "Baixar comprovante"}
      </Button>
      {message && (
        <p
          className={failed ? "field-error" : "download-feedback"}
          role={failed ? "alert" : "status"}
        >
          {message}
        </p>
      )}
    </div>
  );
}
