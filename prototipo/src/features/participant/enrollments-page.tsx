import { Link, useSearchParams } from "react-router-dom";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { participantActivities } from "./participant-selectors";
import { ParticipantHeader } from "./components/participant-header";
import { EnrollmentList } from "./components/enrollment-list";
export function EnrollmentsPage() {
  const { state, users, user } = useDemo();
  const [params, setParams] = useSearchParams();
  if (!user) return null;
  const all = participantActivities(state, users, user.id);
  const selected = params.get("status");
  const filter =
    selected === "Inscrito" || selected === "Concluída" ? selected : "";
  const shown = all.filter(
    (item) => !filter || item.enrollment.status === filter,
  );
  return (
    <div className="participant-page">
      <ParticipantHeader
        eyebrow="SEU CONHECIMENTO EM MOVIMENTO"
        title="Minhas inscrições"
        description="Acompanhe as atividades que fazem parte da sua jornada."
      />
      <div
        className="enrollment-filters"
        role="group"
        aria-label="Filtrar inscrições por status"
      >
        {[
          ["", "Todas"],
          ["Inscrito", "Inscrito"],
          ["Concluída", "Concluída"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() =>
              setParams(value ? { status: value } : {}, { replace: true })
            }
          >
            {label}
            <span>
              {value
                ? all.filter((item) => item.enrollment.status === value).length
                : all.length}
            </span>
          </button>
        ))}
      </div>
      <p className="result-note" role="status">
        {shown.length}{" "}
        {shown.length === 1 ? "inscrição encontrada" : "inscrições encontradas"}
      </p>
      <h2 className="sr-only">Suas atividades</h2>
      {shown.length ? (
        <EnrollmentList items={shown} />
      ) : (
        <EmptyState
          title={
            all.length
              ? "Nenhuma inscrição com este status."
              : "Você ainda não se inscreveu em nenhuma atividade."
          }
          description={
            all.length
              ? "Escolha outro filtro para consultar suas atividades."
              : "Encontre uma atividade que desperte sua curiosidade e comece uma nova troca."
          }
        >
          {all.length ? (
            <Button
              variant="outline"
              onClick={() => setParams({}, { replace: true })}
            >
              Mostrar todas
            </Button>
          ) : (
            <Button asChild>
              <Link to="/catalogo">Explorar atividades</Link>
            </Button>
          )}
        </EmptyState>
      )}
    </div>
  );
}
