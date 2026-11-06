import { SlidersHorizontal, RotateCcw, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import type { CatalogFilters } from "../catalog-selectors";
export function CatalogFilterPanel({
  filters,
  onChange,
  areas,
  formats,
  onClear,
}: {
  filters: CatalogFilters;
  onChange: (values: Partial<CatalogFilters>) => void;
  areas: string[];
  formats: string[];
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const count = [
    filters.area,
    filters.minHours,
    filters.maxHours,
    filters.format,
    filters.onlyAvailable,
  ].filter(Boolean).length;
  const invalidRange =
    filters.minHours !== "" &&
    filters.maxHours !== "" &&
    Number(filters.minHours) > Number(filters.maxHours);
  return (
    <aside
      className="catalog-filters"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        className="filter-toggle"
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="filter-panel"
        onClick={() => setOpen(!open)}
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        Filtros{count > 0 && <span className="filter-count">{count}</span>}
        <ChevronDown size={17} aria-hidden="true" />
      </button>
      <div
        id="filter-panel"
        className={`filter-panel ${open ? "is-open" : ""}`}
      >
        <div className="filter-heading">
          <h2>
            <SlidersHorizontal size={17} aria-hidden="true" />
            Refine sua busca
          </h2>
          <button
            type="button"
            onClick={onClear}
            aria-label="Limpar todos os filtros"
            className="icon-button"
          >
            <RotateCcw size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="field">
          <label htmlFor="area">Área temática</label>
          <select
            id="area"
            value={filters.area}
            onChange={(event) => onChange({ area: event.target.value })}
          >
            <option value="">Todas as áreas</option>
            {areas.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
        </div>
        <fieldset className="hours-fieldset">
          <legend>Carga horária</legend>
          <div className="hours-inputs">
            <div>
              <label htmlFor="min-hours">De (horas)</label>
              <input
                id="min-hours"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                value={filters.minHours}
                onChange={(event) => onChange({ minHours: event.target.value })}
                aria-invalid={invalidRange}
                aria-describedby={invalidRange ? "hours-error" : undefined}
              />
            </div>
            <span aria-hidden="true">—</span>
            <div>
              <label htmlFor="max-hours">Até (horas)</label>
              <input
                id="max-hours"
                type="number"
                min="0"
                step="1"
                placeholder="Sem limite"
                value={filters.maxHours}
                onChange={(event) => onChange({ maxHours: event.target.value })}
                aria-invalid={invalidRange}
                aria-describedby={invalidRange ? "hours-error" : undefined}
              />
            </div>
          </div>
          {invalidRange && (
            <p className="field-error" id="hours-error">
              O limite final deve ser igual ou maior que o inicial.
            </p>
          )}
        </fieldset>
        <div className="field">
          <label htmlFor="format">Formato</label>
          <select
            id="format"
            value={filters.format}
            onChange={(event) => onChange({ format: event.target.value })}
          >
            <option value="">Todos os formatos</option>
            {formats.map((format) => (
              <option key={format}>{format}</option>
            ))}
          </select>
        </div>
        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={filters.onlyAvailable}
            onChange={(event) =>
              onChange({ onlyAvailable: event.target.checked })
            }
          />
          <span>Somente com vagas</span>
        </label>
        <button
          type="button"
          className="clear-filters text-link"
          onClick={onClear}
        >
          <RotateCcw size={14} aria-hidden="true" />
          Limpar filtros
        </button>
        <p className="filter-footnote">
          Aprendizados diferentes.
          <br />
          Novas possibilidades.
        </p>
      </div>
    </aside>
  );
}
