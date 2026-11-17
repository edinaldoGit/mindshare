import { Clock3 } from "lucide-react";
export function HoursSummary({
  hours,
  completed,
}: {
  hours: number;
  completed: number;
}) {
  return (
    <div className="hours-summary">
      <span className="hours-summary-icon">
        <Clock3 size={27} aria-hidden="true" />
      </span>
      <div>
        <span className="eyebrow">CONHECIMENTO QUE FICA</span>
        <p>
          <strong>{hours}</strong> horas acumuladas
        </p>
        <span>
          {completed}{" "}
          {completed === 1 ? "atividade concluída" : "atividades concluídas"} na
          demonstração
        </span>
      </div>
    </div>
  );
}
