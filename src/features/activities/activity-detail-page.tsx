import { DeliveryInfo } from "@/features/learning/delivery-fields";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Clock3,
  MapPin,
  Monitor,
  Users,
  BookOpen,
  Info,
} from "lucide-react";
import { useDemo } from "@/app/providers/demo-context";
import {
  findPublishedActivity,
  availableSeats,
} from "@/features/catalog/catalog-selectors";
import { ActivityCover } from "@/features/catalog/components/activity-cover";
import { EnrollmentAction } from "./enrollment-action";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
export function ActivityDetailPage() {
  const { activityId } = useParams();
  const { activities, enrollments, users } = useDemo();
  const location = useLocation();
  const activity = findPublishedActivity(activities, activityId);
  const catalogSearch: unknown = location.state?.catalogSearch;
  const back = `/catalogo${typeof catalogSearch === "string" && catalogSearch.startsWith("?") ? catalogSearch : ""}`;
  if (!activity)
    return (
      <section className="missing-activity">
        <h1 tabIndex={-1}>Atividade não encontrada</h1>
        <EmptyState
          title="Esta atividade não está disponível."
          description="O endereço pode estar incorreto ou a atividade ainda não foi publicada."
        >
          <Button asChild>
            <Link to="/catalogo">
              Explorar o catálogo
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </Button>
        </EmptyState>
      </section>
    );
  const available = availableSeats(activity, enrollments);
  const instructor = users.find(
    (person) => person.id === activity.instructorId,
  );
  const FormatIcon = activity.format !== "Presencial" ? Monitor : MapPin;
  return (
    <article className="activity-detail">
      <Link to={back} className="back-link">
        <ArrowLeft size={16} aria-hidden="true" />
        Voltar ao catálogo
      </Link>
      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-heading">
            <div className="detail-badges">
              <span className="badge">{activity.thematicArea}</span>
              <span>{activity.activityType}</span>
              <span className="demo-text">Atividade fictícia</span>
            </div>
            <h1 tabIndex={-1}>{activity.title}</h1>
            <p>{activity.summary}</p>
            <div className="activity-meta">
              <span>
                <Clock3 size={16} aria-hidden="true" />
                {activity.hours} horas
              </span>
              <span>
                <FormatIcon size={16} aria-hidden="true" />
                {activity.format}
              </span>
              <span>
                <Users size={16} aria-hidden="true" />
                {activity.capacity} vagas no total
              </span>
            </div>
          </div>
          <ActivityCover area={activity.thematicArea} />
          <section className="detail-section">
            <p className="eyebrow">CONHECIMENTO EM PRÁTICA</p>
            <h2>
              {activity.format === "Remota assíncrona"
                ? "Objetivo e o que você vai aprender"
                : "O que vamos explorar"}
            </h2>
            <p>{activity.syllabus}</p>
          </section>
          <DeliveryInfo activity={activity} publicView />
          <section className="detail-instructor">
            <span className="avatar avatar-large" aria-hidden="true">
              {instructor?.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <div>
              <p className="eyebrow">QUEM COMPARTILHA</p>
              <h2>{instructor?.name}</h2>
              <p>Estudante instrutor · Perfil fictício de demonstração</p>
            </div>
          </section>
          <section className="detail-section category-note">
            <BookOpen size={21} aria-hidden="true" />
            <div>
              <h2>Categoria de horas complementares</h2>
              <p>{activity.category}</p>
              <small>
                Classificação exemplificativa. As categorias oficiais da UFC
                ainda precisam ser confirmadas.
              </small>
            </div>
          </section>
        </div>
        <aside
          className="enrollment-panel"
          aria-labelledby="participation-heading"
        >
          <span className="eyebrow">APRENDA ALGO NOVO</span>
          <h2 id="participation-heading">
            Uma troca pode
            <br />
            abrir caminhos.
          </h2>
          <div className="seat-highlight">
            <strong>{available}</strong>
            <span>
              {available === 1 ? "vaga disponível" : "vagas disponíveis"}
              <small>de {activity.capacity} vagas no total</small>
            </span>
          </div>
          <dl>
            <div>
              <dt>Carga horária</dt>
              <dd>{activity.hours} horas</dd>
            </div>
            <div>
              <dt>Formato</dt>
              <dd>{activity.format}</dd>
            </div>
            <div>
              <dt>Atividade</dt>
              <dd>{activity.activityType}</dd>
            </div>
          </dl>
          <EnrollmentAction activity={activity} />
          <div className="certificate-note">
            <Info size={16} aria-hidden="true" />
            <p>
              A emissão de comprovantes não garante o reconhecimento da carga
              horária pela UFC.
            </p>
          </div>
        </aside>
      </div>
    </article>
  );
}
