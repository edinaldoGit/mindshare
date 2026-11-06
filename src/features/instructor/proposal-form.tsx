import { DeliveryFields } from "@/features/learning/delivery-fields";
import {
  activeCurators,
  deliveryError,
  emptyDelivery,
} from "@/lib/demo/evolution";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import { FeedbackMessage } from "@/components/feedback/feedback-message";
import { canEditProposal } from "@/lib/policies";
import { proposalInputErrors, type ProposalInput } from "@/lib/demo/state";
import type { Activity } from "@/types/domain";

const empty: ProposalInput = {
  title: "",
  syllabus: "",
  hours: 4,
  format: "Presencial",
  category: "",
  capacity: 20,
  thematicArea: "",
  activityType: "Oficina",
};
const labels: Record<string, string> = {
  title: "Título da atividade",
  syllabus: "Ementa",
  hours: "Carga horária (horas)",
  format: "Formato",
  category: "Categoria de horas complementares",
  capacity: "Número de vagas",
  thematicArea: "Área temática",
  activityType: "Tipo de atividade",
};
function adjustmentReason(activity: Activity) {
  const decision = activity.decisions.at(-1);
  return decision?.outcome === "Ajustes solicitados"
    ? decision.reason
    : "Consulte os comentários da curadoria.";
}

export function ProposalForm({ editing = false }: { editing?: boolean }) {
  const { id } = useParams();
  const { user, state, createProposal, updateProposal } = useDemo();
  const navigate = useNavigate();
  const activity = editing
    ? state.activities.find((item) => item.id === id)
    : undefined;
  const authorized = !!activity && canEditProposal(user, activity);
  const [values, setValues] = useState<ProposalInput>(
    activity
      ? {
          title: activity.title,
          syllabus: activity.syllabus,
          hours: activity.hours,
          format: activity.format,
          category: activity.category,
          capacity: activity.capacity,
          thematicArea: activity.thematicArea,
          activityType: activity.activityType,
          curatorId: activity.curatorId,
          delivery: activity.delivery ?? emptyDelivery(),
        }
      : empty,
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProposalInput, string>>
  >({});
  const focusError = useRef(false);
  const [message, setMessage] = useState("");
  const areas = useMemo(
    () =>
      [...new Set(state.activities.map((item) => item.thematicArea))].sort(
        (a, b) => a.localeCompare(b, "pt-BR"),
      ),
    [state.activities],
  );
  const categories = useMemo(
    () => [...new Set(state.activities.map((item) => item.category))],
    [state.activities],
  );
  useEffect(() => {
    if (!focusError.current) return;
    document
      .querySelector<HTMLElement>('.proposal-form [aria-invalid="true"]')
      ?.focus();
    focusError.current = false;
  }, [errors]);
  if (editing && !authorized)
    return (
      <section className="instructor-page">
        <p className="eyebrow">EDIÇÃO INDISPONÍVEL</p>
        <h1>Esta proposta não pode ser editada.</h1>
        <p>
          A edição fica disponível somente quando a curadoria solicita ajustes.
        </p>
        <Button asChild variant="outline">
          <Link to={id ? `/instrutor/propostas/${id}` : "/instrutor/propostas"}>
            Voltar à proposta
          </Link>
        </Button>
      </section>
    );

  function change<K extends keyof ProposalInput>(
    key: K,
    value: ProposalInput[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = proposalInputErrors(values);
    const detailError = deliveryError(values);
    if (detailError) next.delivery = detailError;
    if (!activeCurators(state).some((u) => u.id === values.curatorId))
      next.curatorId = "Selecione o Professor Curador responsável.";
    if (Object.keys(next).length) {
      setErrors(next);
      setMessage("Revise os campos destacados antes de salvar.");
      focusError.current = true;
      return;
    }
    const result =
      editing && id ? updateProposal(id, values) : createProposal(values);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    const proposalId = editing ? id : (result as { id?: string }).id;
    if (proposalId)
      navigate(`/instrutor/propostas/${proposalId}`, {
        state: { notice: result.message },
      });
  }

  return (
    <div className="instructor-page">
      <Link
        className="instructor-back-link"
        to={
          editing && id ? `/instrutor/propostas/${id}` : "/instrutor/propostas"
        }
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {editing ? "Voltar à proposta" : "Minhas propostas"}
      </Link>
      <div className="instructor-page-heading">
        <div>
          <p className="eyebrow">
            {editing ? "RESPOSTA À CURADORIA" : "IDEIA EM CONSTRUÇÃO"}
          </p>
          <h1>{editing ? "Ajustar proposta" : "Criar uma proposta"}</h1>
          <p>
            {editing
              ? "Revise os pontos indicados e salve para preparar uma nova submissão."
              : "Conte o que você gostaria de compartilhar. A proposta começa como rascunho."}
          </p>
        </div>
      </div>
      {message && <FeedbackMessage error>{message}</FeedbackMessage>}
      {editing && activity && (
        <aside className="curation-feedback">
          <p className="eyebrow">AJUSTES SOLICITADOS</p>
          <p>{adjustmentReason(activity)}</p>
        </aside>
      )}
      <form className="proposal-form" noValidate onSubmit={save}>
        <section className="proposal-form-section">
          <p className="eyebrow">01 · A ATIVIDADE</p>
          <h2>O que você quer compartilhar?</h2>
          <label className="instructor-field" htmlFor="proposal-title">
            {labels.title}
            <input
              id="proposal-title"
              value={values.title}
              aria-invalid={!!errors.title}
              aria-describedby={
                errors.title ? "proposal-title-error" : undefined
              }
              onChange={(event) => change("title", event.target.value)}
            />
            {errors.title && (
              <span id="proposal-title-error" className="field-error">
                {errors.title}
              </span>
            )}
          </label>
          <label className="instructor-field" htmlFor="proposal-syllabus">
            {labels.syllabus}
            <textarea
              id="proposal-syllabus"
              rows={5}
              value={values.syllabus}
              aria-invalid={!!errors.syllabus}
              aria-describedby={
                errors.syllabus ? "proposal-syllabus-error" : "syllabus-help"
              }
              onChange={(event) => change("syllabus", event.target.value)}
            />
            <span id="syllabus-help" className="field-hint">
              Descreva o conteúdo e o que os participantes poderão aprender.
            </span>
            {errors.syllabus && (
              <span id="proposal-syllabus-error" className="field-error">
                {errors.syllabus}
              </span>
            )}
          </label>
          <div className="proposal-form-grid">
            <label className="instructor-field" htmlFor="proposal-area">
              {labels.thematicArea}
              <select
                id="proposal-area"
                value={values.thematicArea}
                aria-invalid={!!errors.thematicArea}
                aria-describedby={
                  errors.thematicArea ? "proposal-area-error" : undefined
                }
                onChange={(event) => change("thematicArea", event.target.value)}
              >
                <option value="">Escolha uma área</option>
                {areas.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              {errors.thematicArea && (
                <span id="proposal-area-error" className="field-error">
                  {errors.thematicArea}
                </span>
              )}
            </label>
            <label className="instructor-field" htmlFor="proposal-type">
              {labels.activityType}
              <select
                id="proposal-type"
                value={values.activityType}
                onChange={(event) =>
                  change(
                    "activityType",
                    event.target.value as ProposalInput["activityType"],
                  )
                }
              >
                {["Aula", "Minicurso", "Oficina", "Grupo de estudo"].map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </label>
          </div>
        </section>
        <section className="proposal-form-section">
          <p className="eyebrow">02 · ORGANIZAÇÃO</p>
          <h2>Como a atividade vai acontecer?</h2>
          <div className="proposal-form-grid">
            <label className="instructor-field" htmlFor="proposal-hours">
              {labels.hours}
              <input
                id="proposal-hours"
                type="number"
                min="0.1"
                step="any"
                value={values.hours}
                aria-invalid={!!errors.hours}
                aria-describedby={
                  errors.hours ? "proposal-hours-error" : undefined
                }
                onChange={(event) =>
                  change(
                    "hours",
                    event.target.value === "" ? 0 : Number(event.target.value),
                  )
                }
              />
              {errors.hours && (
                <span id="proposal-hours-error" className="field-error">
                  {errors.hours}
                </span>
              )}
            </label>
            <label className="instructor-field" htmlFor="proposal-capacity">
              {labels.capacity}
              <input
                id="proposal-capacity"
                type="number"
                min="1"
                step="1"
                value={values.capacity}
                aria-invalid={!!errors.capacity}
                aria-describedby={
                  errors.capacity ? "proposal-capacity-error" : undefined
                }
                onChange={(event) =>
                  change(
                    "capacity",
                    event.target.value === "" ? 0 : Number(event.target.value),
                  )
                }
              />
              {errors.capacity && (
                <span id="proposal-capacity-error" className="field-error">
                  {errors.capacity}
                </span>
              )}
            </label>
          </div>
          <div className="proposal-form-grid">
            <label className="instructor-field" htmlFor="proposal-format">
              {labels.format}
              <select
                id="proposal-format"
                value={values.format}
                onChange={(event) => change("format", event.target.value)}
              >
                {["Presencial", "Remota síncrona", "Remota assíncrona"].map(
                  (item) => (
                    <option key={item}>{item}</option>
                  ),
                )}
              </select>
            </label>
            <label className="instructor-field" htmlFor="proposal-category">
              {labels.category}
              <select
                id="proposal-category"
                value={values.category}
                aria-invalid={!!errors.category}
                aria-describedby={
                  errors.category
                    ? "proposal-category-error"
                    : "proposal-category-help"
                }
                onChange={(event) => change("category", event.target.value)}
              >
                <option value="">Escolha uma categoria</option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              {errors.category && (
                <span id="proposal-category-error" className="field-error">
                  {errors.category}
                </span>
              )}
              <span id="proposal-category-help" className="field-hint">
                Categorias exibidas são exemplos; a classificação oficial ainda
                precisa ser confirmada.
              </span>
            </label>
          </div>
        </section>
        <DeliveryFields
          values={values}
          errors={errors}
          locked={!!activity?.submittedAt}
          onChange={(patch) => {
            setValues((v) => ({ ...v, ...patch }));
            setErrors((e) => ({
              ...e,
              delivery: undefined,
              curatorId: undefined,
            }));
          }}
        />
        <div className="proposal-form-actions">
          <Button type="submit">
            <Save size={16} aria-hidden="true" />
            {editing ? "Salvar ajustes" : "Salvar como rascunho"}
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </form>
    </div>
  );
}
