import { Search, X, ArrowUpRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { ActivityCard } from "./components/activity-card";
import { CatalogFilterPanel } from "./components/catalog-filters";
import {
  filterActivities,
  readCatalogFilters,
  writeCatalogFilters,
  publishedActivities,
  emptyFilters,
  type CatalogFilters,
} from "./catalog-selectors";
export function CatalogPage() {
  const { activities, enrollments } = useDemo();
  const [params, setParams] = useSearchParams();
  const filters = readCatalogFilters(params);
  const published = publishedActivities(activities);
  const areas = [
    ...new Set(published.map((activity) => activity.thematicArea)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const formats = [...new Set(published.map((activity) => activity.format))];
  const results = filterActivities(activities, enrollments, filters);
  const update = (patch: Partial<CatalogFilters>) =>
    setParams(writeCatalogFilters({ ...filters, ...patch }), { replace: true });
  const clear = () => setParams({}, { replace: true });
  const chips = [
    { key: "area", label: filters.area },
    {
      key: "minHours",
      label: filters.minHours ? `A partir de ${filters.minHours} h` : "",
    },
    {
      key: "maxHours",
      label: filters.maxHours ? `Até ${filters.maxHours} h` : "",
    },
    { key: "format", label: filters.format },
    { key: "onlyAvailable", label: filters.onlyAvailable ? "Com vagas" : "" },
  ] as const;
  return (
    <div className="catalog-page">
      <section className="catalog-intro">
        <div>
          <p className="eyebrow">CURIOSIDADE É UM BOM COMEÇO</p>
          <h1 tabIndex={-1}>
            Encontre sua próxima
            <br />
            <span>descoberta.</span>
          </h1>
          <p>Novos temas, outras perspectivas e conhecimento compartilhado.</p>
        </div>
        <div className="catalog-intro-note">
          <span className="tiny-orbit" aria-hidden="true" />
          <span>
            Feito por estudantes.
            <br />
            <strong>Para aprender em comunidade.</strong>
          </span>
        </div>
      </section>
      <div className="search-box">
        <Search size={21} aria-hidden="true" />
        <label htmlFor="activity-search" className="sr-only">
          Buscar atividades por título ou ementa
        </label>
        <input
          id="activity-search"
          type="search"
          placeholder="O que você quer aprender?"
          value={filters.query}
          onChange={(event) => update({ query: event.target.value })}
        />
        {filters.query && (
          <button
            type="button"
            className="icon-button"
            aria-label="Limpar busca"
            onClick={() => update({ query: "" })}
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
        <span className="search-hint">Explore novas ideias</span>
      </div>
      <div className="catalog-layout">
        <CatalogFilterPanel
          filters={filters}
          onChange={update}
          areas={areas}
          formats={formats}
          onClear={() => update({ ...emptyFilters, query: filters.query })}
        />
        <section
          className="catalog-results"
          aria-label="Resultados de atividades"
        >
          <h2 className="sr-only">Atividades encontradas</h2>
          <div className="results-heading">
            <p role="status" aria-live="polite" aria-atomic="true">
              <strong>{results.length}</strong>{" "}
              {results.length === 1
                ? "atividade encontrada"
                : "atividades encontradas"}
            </p>
            <span>Atividades demonstrativas</span>
          </div>
          {chips.some((chip) => chip.label) && (
            <div className="active-filters" aria-label="Filtros aplicados">
              {chips
                .filter((chip) => chip.label)
                .map((chip) => (
                  <button
                    type="button"
                    key={chip.key}
                    onClick={() =>
                      update({
                        [chip.key]: chip.key === "onlyAvailable" ? false : "",
                      })
                    }
                    aria-label={`Remover filtro: ${chip.label}`}
                  >
                    {chip.label}
                    <X size={12} aria-hidden="true" />
                  </button>
                ))}
            </div>
          )}
          {results.length ? (
            <div className="activity-grid catalog-grid">
              {results.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={
                filters.query
                  ? "Ainda não encontramos essa ideia."
                  : "Nenhuma atividade com essa combinação."
              }
              description={
                filters.query
                  ? "Tente outro termo ou ajuste os filtros. A busca considera o título e a ementa das atividades."
                  : "Experimente ampliar o intervalo de horas ou explorar outro formato e área temática."
              }
            >
              <Button variant="outline" onClick={clear}>
                Limpar busca e filtros
              </Button>
            </EmptyState>
          )}
          <div className="catalog-bottom-note">
            <span>Tem algo que você gostaria de ensinar?</span>
            <Link to="/entrar?retorno=%2Finstrutor">
              Compartilhe seu conhecimento
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
