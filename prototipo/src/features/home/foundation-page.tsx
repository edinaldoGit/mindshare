import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Search,
  Users,
  Sparkles,
  MoveUpRight,
  BookOpen,
  Check,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/section-heading";
import { ActivityCard } from "@/features/catalog/components/activity-card";
import { ActivityCover } from "@/features/catalog/components/activity-cover";
import {
  publishedActivities,
  availableSeats,
} from "@/features/catalog/catalog-selectors";
import { useDemo } from "@/app/providers/demo-context";
import { brand } from "@/lib/brand";
const steps = [
  {
    number: "01",
    title: "Encontre sua próxima descoberta.",
    description:
      "Explore temas, formatos e possibilidades que combinam com o que você quer aprender.",
    icon: Search,
  },
  {
    number: "02",
    title: "Aprenda em boa companhia.",
    description:
      "Participe de atividades conduzidas por colegas e construa conhecimento na prática.",
    icon: Users,
  },
  {
    number: "03",
    title: "Faça seu conhecimento circular.",
    description:
      "Tem algo para ensinar? Proponha uma atividade para análise de um Professor Curador.",
    icon: Sparkles,
  },
];
export function FoundationPage() {
  const { activities, enrollments } = useDemo();
  const featured = publishedActivities(activities).slice(0, 3);
  const spotlight = featured[0];
  return (
    <>
      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="small-line" />
            DE ESTUDANTE PARA ESTUDANTE
          </p>
          <h1 tabIndex={-1}>
            Conhecimento
            <br />
            cresce quando é<br />
            <span>compartilhado.</span>
          </h1>
          <p className="hero-description">
            Descubra atividades, aprenda com outros estudantes e compartilhe o
            que você sabe. Na UFC Quixadá, toda troca pode abrir um novo
            caminho.
          </p>
          <div className="hero-actions">
            <Button asChild>
              <Link to="/catalogo">
                Explorar atividades
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                document.getElementById("como-funciona")?.scrollIntoView()
              }
            >
              Como funciona
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
          <div className="hero-footnote">
            <span className="mini-symbol">
              <img src={brand.icon} alt="" width="477" height="407" />
            </span>
            <p>
              Um espaço para aprender.
              <br />
              <strong>E muito para compartilhar.</strong>
            </p>
          </div>
        </div>
        <div className="hero-composition">
          <div className="composition-label">
            <span className="demo-dot" />
            IDEIAS EM MOVIMENTO <MoveUpRight size={16} aria-hidden="true" />
          </div>
          <div className="composition-orbit" aria-hidden="true" />
          <div className="hero-course">
            <ActivityCover area={spotlight.thematicArea} compact />
            <div className="hero-course-body">
              <div className="card-kicker">
                <span>{spotlight.thematicArea}</span>
                <span>{spotlight.activityType}</span>
              </div>
              <h2>{spotlight.title}</h2>
              <p>Da ideia à primeira experiência interativa.</p>
              <div className="hero-course-meta">
                <span>
                  {spotlight.hours} horas · {spotlight.format}
                </span>
                <span>{availableSeats(spotlight, enrollments)} vagas</span>
              </div>
              <Link to={`/atividades/${spotlight.id}`}>
                Conhecer a atividade
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="exchange-note">
            <span className="note-icon">
              <BookOpen size={20} aria-hidden="true" />
            </span>
            <span>
              Você aprende.
              <br />
              <strong>A comunidade cresce.</strong>
            </span>
          </div>
          <div className="composition-caption">
            <span>CONEXÕES QUE VIRAM POSSIBILIDADES</span>
            <span>Atividade fictícia</span>
          </div>
        </div>
      </section>
      <div className="purpose-strip">
        <span>UM CAMPUS. MUITAS POSSIBILIDADES.</span>
        <p>
          Aprender com quem está perto.
          <br className="mobile-only" /> Ir além do que você já conhece.
        </p>
        <ArrowDownMark />
      </div>
      <section id="como-funciona" className="section-block how-section">
        <SectionHeading eyebrow="SIMPLES ASSIM" title="Cada troca é um começo.">
          <p>
            Do primeiro interesse à próxima ideia.
            <br />O conhecimento encontra seu caminho.
          </p>
        </SectionHeading>
        <div className="steps-grid">
          {steps.map(({ number, title, description, icon: Icon }) => (
            <article className="step-card" key={number}>
              <div className="step-top">
                <span>{number}</span>
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section-block featured-section">
        <SectionHeading
          eyebrow="EXPLORE NOVAS POSSIBILIDADES"
          title="O que você quer aprender agora?"
        >
          <Link className="text-link" to="/catalogo">
            Ver todas as atividades
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </SectionHeading>
        <p className="section-description">
          Uma seleção para despertar sua curiosidade. Todas as atividades abaixo
          são demonstrativas.
        </p>
        <div className="activity-grid">
          {featured.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
      <section className="teach-section">
        <div className="teach-visual" aria-hidden="true">
          <div className="teach-symbol">
            <img src={brand.icon} alt="" width="477" height="407" />
          </div>
          <div className="teach-tag">
            <Check size={16} />
            Uma ideia sua pode inspirar alguém.
          </div>
          <span className="teach-coordinate">
            CONHECIMENTO EM COMUM / MINDShare
          </span>
        </div>
        <div className="teach-copy">
          <p className="eyebrow">SEU CONHECIMENTO TEM LUGAR AQUI</p>
          <h2>
            Você também
            <br />
            tem muito
            <br />
            <span>para ensinar.</span>
          </h2>
          <p>
            Uma habilidade, uma descoberta, um jeito diferente de resolver um
            problema. Compartilhe o que você sabe e ajude outros estudantes a ir
            além.
          </p>
          <p className="teach-curation">
            As propostas passam pela análise de um Professor Curador antes de
            aparecerem no catálogo.
          </p>
          <Button asChild>
            <Link to="/entrar?retorno=%2Finstrutor">
              Quero compartilhar
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>
      <section className="final-invitation">
        <span className="eyebrow">
          SEU PRÓXIMO APRENDIZADO COMEÇA EM UMA TROCA
        </span>
        <h2>Vamos aprender juntos?</h2>
        <p>Encontre um tema que desperte sua curiosidade.</p>
        <Button asChild>
          <Link to="/catalogo">
            Encontrar uma atividade
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </Button>
      </section>
    </>
  );
}
function ArrowDownMark() {
  return (
    <ArrowDownRight className="purpose-arrow" size={19} aria-hidden="true" />
  );
}
