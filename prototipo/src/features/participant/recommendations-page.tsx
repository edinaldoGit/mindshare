import { useState, type FormEvent } from "react";
import { Compass, ArrowUpRight } from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { ActivityCard } from "@/features/catalog/components/activity-card";
import { publishedActivities } from "@/features/catalog/catalog-selectors";
import { ParticipantHeader } from "./components/participant-header";
import { recommendActivities } from "./participant-selectors";
export function RecommendationsPage() {
  const { state, user } = useDemo();
  const [area, setArea] = useState("");
  const [hours, setHours] = useState("");
  const [exclude, setExclude] = useState(true);
  const [applied, setApplied] = useState<{
    area: string;
    hours: number;
    exclude: boolean;
  } | null>(null);
  const [errors, setErrors] = useState<{ area?: string; hours?: string }>({});
  if (!user) return null;
  const areas = [
    ...new Set(
      publishedActivities(state.activities).map(
        (activity) => activity.thematicArea,
      ),
    ),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const results = applied
    ? recommendActivities(
        state,
        user.id,
        applied.area,
        applied.hours,
        applied.exclude,
      )
    : [];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = {
      area: area ? "" : "Escolha uma área de interesse.",
      hours:
        hours && Number.isFinite(Number(hours)) && Number(hours) > 0
          ? ""
          : "Informe uma quantidade de horas maior que zero.",
    };
    setErrors(next);
    if (next.area || next.hours) {
      document
        .getElementById(next.area ? "interest-area" : "interest-hours")
        ?.focus();
      return;
    }
    setApplied({ area, hours: Number(hours), exclude });
  }
  return (
    <div className="participant-page">
      <ParticipantHeader
        eyebrow="UM CAMINHO QUE COMBINA COM VOCÊ"
        title="Dê espaço à curiosidade."
        description="Encontre atividades que combinam com seus interesses e sua disponibilidade."
      />
      <form className="recommendation-form" onSubmit={submit} noValidate>
        <div className="recommendation-fields">
          <div className="field">
            <label htmlFor="interest-area">O que você quer aprender?</label>
            <select
              id="interest-area"
              value={area}
              onChange={(event) => setArea(event.target.value)}
              aria-invalid={!!errors.area}
              aria-describedby={errors.area ? "interest-area-error" : undefined}
            >
              <option value="">Escolha uma área</option>
              {areas.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>
            {errors.area && (
              <p id="interest-area-error" className="field-error">
                {errors.area}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="interest-hours">Até quantas horas?</label>
            <input
              id="interest-hours"
              type="number"
              min="1"
              step="1"
              placeholder="Ex.: 8"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              aria-invalid={!!errors.hours}
              aria-describedby={
                errors.hours ? "interest-hours-error" : undefined
              }
            />
            {errors.hours && (
              <p id="interest-hours-error" className="field-error">
                {errors.hours}
              </p>
            )}
          </div>
          <Button type="submit">
            Encontrar atividades
            <ArrowUpRight size={16} aria-hidden="true" />
          </Button>
        </div>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={exclude}
            onChange={(event) => setExclude(event.target.checked)}
          />
          <span>Ocultar atividades em que já estou inscrito</span>
        </label>
        <p className="field-hint">
          Buscamos apenas atividades aprovadas da área escolhida, com duração de
          até o limite informado. Cada atividade respeita esse limite; ele não é
          dividido entre os resultados.
        </p>
      </form>
      {applied ? (
        <section
          className="recommendation-results"
          aria-label="Atividades por interesse"
        >
          <div className="recommendation-results-heading">
            <h2>Possibilidades para explorar</h2>
            <p role="status">
              {results.length}{" "}
              {results.length === 1
                ? "atividade encontrada"
                : "atividades encontradas"}{" "}
              · {applied.area} · até {applied.hours} {applied.hours === 1 ? "hora" : "horas"}
            </p>
          </div>
          {results.length ? (
            <div className="activity-grid participant-suggestions">
              {results.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Vamos tentar outro caminho?"
              description="Nenhuma atividade atende a essa combinação. Aumente o limite de horas, escolha outra área ou inclua as atividades em que você já está inscrito."
            />
          )}
        </section>
      ) : (
        <div className="recommendation-intro">
          <Compass size={42} strokeWidth={1.3} aria-hidden="true" />
          <h2>Uma ideia de cada vez.</h2>
          <p>
            Escolha um interesse e o tempo que você tem. As possibilidades
            aparecem por aqui.
          </p>
        </div>
      )}
    </div>
  );
}
