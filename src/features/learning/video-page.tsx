import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDemo } from "@/app/providers/demo-context";
import { Button } from "@/components/ui/button";
import {
  saveVideoProgress,
  validPlaybackSpan,
  validatedSeconds,
  videoSummary,
} from "@/lib/demo/evolution";
import type { Activity, Lesson } from "@/types/domain";
export function VideoPage() {
  const { activityId } = useParams();
  const { state, user } = useDemo();
  const a = state.activities.find(
    (a) =>
      a.id === activityId &&
      a.status === "Aprovada" &&
      a.format === "Remota assíncrona" &&
      state.enrollments.some(
        (e) => e.activityId === a.id && e.participantId === user?.id,
      ),
  );
  const [selected, setSelected] = useState(0);
  if (!a || !user || !a.delivery)
    return (
      <section className="participant-page">
        <h1>Videoaulas indisponíveis</h1>
        <p>
          Inscreva-se e entre como Participante para acompanhar esta atividade.
        </p>
        <Link to={`/atividades/${activityId}`}>Consultar atividade</Link>
      </section>
    );
  const progress = videoSummary(state, a, user.id);
  const lesson = a.delivery.lessons[selected];
  return (
    <div className="participant-page learning-page">
      <Link to={`/participante/atividades/${a.id}`}>← Voltar à atividade</Link>
      <p className="eyebrow">REMOTA ASSÍNCRONA · APRENDA NO SEU RITMO</p>
      <h1>{a.title}</h1>

      <div className="video-layout">
        <div>
          {lesson && (
            <VideoLessonPlayer
              key={`${user.id}:${a.id}:${lesson.id}`}
              activity={a}
              lesson={lesson}
            />
          )}
        </div>
        <aside className="learning-card">
          <p className="eyebrow">SEU PERCURSO</p>
          <h2>Videoaulas</h2>
          <p>
            <strong>Progresso do curso: {progress.percent.toFixed(1)}%</strong>
          </p>
          <p className="field-hint">
            Mínimo para conclusão: {a.delivery.minimum}%. Confirmação final pelo
            Instrutor.
          </p>
          {a.delivery.lessons.map((l, i) => {
            const p = state.progress.find(
              (p) =>
                p.activityId === a.id &&
                p.lessonId === l.id &&
                p.participantId === user.id,
            );
            return (
              <button
                className="lesson-choice"
                aria-current={selected === i ? "true" : undefined}
                key={l.id}
                onClick={() => setSelected(i)}
              >
                {i + 1}. {l.title}
                <small>
                  {l.required ? "Obrigatória" : "Opcional"} ·{" "}
                  {(
                    (validatedSeconds(p?.intervals ?? []) / l.duration) *
                    100
                  ).toFixed(1)}
                  %
                </small>
              </button>
            );
          })}
          <p className="field-hint">
            O progresso é um indicador de interação com a interface. Não
            comprova atenção ou aprendizagem. A confirmação final cabe ao
            Instrutor.
          </p>
        </aside>
      </div>
    </div>
  );
}
function VideoLessonPlayer({
  activity,
  lesson,
}: {
  activity: Activity;
  lesson: Lesson;
}) {
  const { state, user, run } = useDemo();
  const video = useRef<HTMLVideoElement>(null),
    dialog = useRef<HTMLDialogElement>(null);
  const [phase, setPhase] = useState<"waiting" | "expired" | "later" | null>(
      null,
    ),
    [remaining, setRemaining] = useState(30),
    [deadline, setDeadline] = useState(30),
    [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [accelerated, setAccelerated] = useState(
    () =>
      new URLSearchParams(window.location.search).get("demo") === "1" &&
      sessionStorage.getItem("mindshare:studio:fast") === "1",
  );
  const blocked = useRef(false),
    last = useRef<{ time: number; wall: number } | null>(null);
  const progress = state.progress.find(
    (p) =>
      p.activityId === activity.id &&
      p.lessonId === lesson.id &&
      p.participantId === user?.id,
  );
  const initialPosition = useRef(progress?.position ?? 0);
  const seconds = validatedSeconds(progress?.intervals ?? []);
  const sinceCheck = useRef(
    Math.max(0, seconds - (progress?.confirmedSeconds ?? 0)),
  );
  const interval = accelerated
    ? 15
    : Math.min(300, Math.max(15, lesson.duration / 2));
  useEffect(() => {
    const update = () =>
      setAccelerated(
        new URLSearchParams(window.location.search).get("demo") === "1" &&
          sessionStorage.getItem("mindshare:studio:fast") === "1",
      );
    window.addEventListener("mindshare:studio-settings", update);
    return () =>
      window.removeEventListener("mindshare:studio-settings", update);
  }, []);
  useEffect(() => {
    const hidden = () => {
      if (document.hidden) {
        video.current?.pause();
        last.current = null;
      }
    };
    document.addEventListener("visibilitychange", hidden);
    return () => document.removeEventListener("visibilitychange", hidden);
  }, []);
  useEffect(() => {
    const el = dialog.current;
    if (phase === "waiting" || phase === "expired") {
      if (!el?.open) el?.showModal();
    } else if (el?.open) el.close();
  }, [phase]);
  useEffect(() => {
    if (phase !== "waiting") return;
    const began = Date.now();
    const timer = window.setInterval(() => {
      const n = Math.max(0, deadline - Math.floor((Date.now() - began) / 1000));
      setRemaining(n);
      if (n === 0) {
        setPhase("expired");
        video.current?.pause();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, deadline]);
  function checkpoint() {
    blocked.current = true;
    video.current?.pause();
    last.current = null;
    setRemaining(deadline);
    setPhase("waiting");
  }
  function tick() {
    const el = video.current;
    if (
      !el ||
      el.paused ||
      el.seeking ||
      document.hidden ||
      blocked.current ||
      el.error
    ) {
      last.current = null;
      return;
    }
    const now = performance.now();
    const previous = last.current;
    last.current = { time: el.currentTime, wall: now };
    if (!previous) return;
    const delta = el.currentTime - previous.time,
      wall = (now - previous.wall) / 1000;
    if (
      validPlaybackSpan({
        delta,
        wall,
        rate: el.playbackRate,
        paused: el.paused,
        seeking: el.seeking,
        hidden: document.hidden,
        blocked: blocked.current,
        error: !!el.error,
      })
    ) {
      run((s, u) =>
        saveVideoProgress(
          s,
          u,
          activity.id,
          lesson.id,
          previous.time,
          Math.min(el.currentTime, lesson.duration),
          Math.min(el.currentTime, lesson.duration),
        ),
      );
      sinceCheck.current += delta;
      if (sinceCheck.current >= interval) checkpoint();
    }
  }
  function confirm() {
    const el = video.current;
    if (!el) return;
    const position = Math.min(el.currentTime, lesson.duration);
    run((s, u) =>
      saveVideoProgress(
        s,
        u,
        activity.id,
        lesson.id,
        position,
        position,
        position,
        position,
      ),
    );
    sinceCheck.current = 0;
    blocked.current = false;
    dialog.current?.close();
    setPhase(null);
    last.current = null;
    void el
      .play()
      .catch(() => setError("Use o botão Reproduzir para continuar."));
  }
  return (
    <section className="video-player-card">
      <h2>{lesson.title}</h2>
      <div className="video-surface" aria-busy={loading && !error}>
        <video
          ref={video}
          controls
          playsInline
          preload="metadata"
          src={`${import.meta.env.BASE_URL}${lesson.src}`}
          poster={`${import.meta.env.BASE_URL}media/big-buck-bunny-poster.jpg`}
          aria-label={lesson.title}
          onWaiting={() => {
            last.current = null;
            setLoading(true);
          }}
          onCanPlay={() => setLoading(false)}
          onPlaying={() => setLoading(false)}
          onLoadedData={() => setLoading(false)}
          onTimeUpdate={tick}
          onPlay={() => {
            if (blocked.current || sinceCheck.current >= interval) checkpoint();
            else last.current = null;
          }}
          onPause={() => {
            last.current = null;
          }}
          onSeeking={() => {
            setLoading(true);
            last.current = null;
          }}
          onSeeked={() => {
            setLoading(false);
            last.current = null;
          }}
          onLoadedMetadata={() => {
            setLoading(false);
            if (video.current)
              video.current.currentTime = Math.min(
                initialPosition.current,
                lesson.duration - 0.1,
              );
          }}
          onError={() => {
            setLoading(false);
            last.current = null;
            setError(
              "Não foi possível carregar a videoaula. Confira sua conexão e tente novamente.",
            );
          }}
        />
        {loading && !error && (
          <span className="video-loading" role="status">
            Carregando vídeo…
          </span>
        )}
      </div>
      {error && (
        <div role="alert">
          <p>{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              setError("");
              initialPosition.current =
                video.current?.currentTime ?? initialPosition.current;
              setLoading(true);
              video.current?.load();
            }}
          >
            Tentar carregar novamente
          </Button>
        </div>
      )}
      <p>
        {lesson.description ||
          "Observe a cena e relacione os conceitos apresentados nesta aula."}
      </p>
      <div className="video-progress-bar">
        <p>
          Acompanhamento validado desta aula:{" "}
          {((seconds / lesson.duration) * 100).toFixed(1)}% ·{" "}
          {progress?.checkpoints.length ?? 0} confirmação(ões)
        </p>
      </div>
      {phase === "later" && (
        <Button onClick={() => checkpoint()}>Retomar com confirmação</Button>
      )}
      {accelerated && (
        <p className="studio-speed-note">
          Demo Studio: verificação acelerada a cada 15 s. O mínimo de conclusão
          publicado permanece {activity.delivery?.minimum}%.
        </p>
      )}
      <details className="learning-card">
        <summary>Sobre o acompanhamento e a acessibilidade</summary>
        <p>
          A reprodução pausa durante a confirmação e quando a aba fica oculta.
          Avançar na barra não valida trechos ignorados. Reassistir não duplica
          progresso. Nenhuma câmera, microfone, biometria ou gravação de tela é
          utilizada.
        </p>
        <label className="instructor-field">
          Prazo para responder (segundos)
          <input
            type="number"
            min={10}
            max={120}
            value={deadline}
            onChange={(e) =>
              setDeadline(Math.max(10, Math.min(120, Number(e.target.value))))
            }
          />
        </label>
        <p>
          Intervalo atual de confirmação: {interval} segundos. Você pode
          interromper e retomar sem perda do que foi validado.
        </p>
      </details>
      <div className="media-attribution">
        <h3>Descrição do conteúdo</h3>
        <p>
          Trecho de animação sem fala: um coelho em uma floresta observa e
          interage com pequenos animais. A atividade propõe observar
          enquadramento, composição e movimento; sons e música não contêm
          instruções verbais.
        </p>
        <p>
          Big Buck Bunny © 2008, Blender Foundation /{" "}
          <a
            href="https://www.bigbuckbunny.org"
            target="_blank"
            rel="noreferrer"
          >
            www.bigbuckbunny.org
          </a>
          .{" "}
          <a
            href="https://creativecommons.org/licenses/by/3.0/"
            target="_blank"
            rel="noreferrer"
          >
            CC BY 3.0
          </a>
          . Trecho recortado e comprimido para demonstração educacional.
        </p>
      </div>
      <dialog
        className="attention-dialog"
        ref={dialog}
        aria-labelledby="attention-title"
        aria-describedby="attention-description"
        onCancel={(e) => {
          e.preventDefault();
          dialog.current?.close();
          setPhase("later");
        }}
      >
        <p className="eyebrow">UMA PAUSA NO SEU PERCURSO</p>
        <h2 id="attention-title">Você ainda está acompanhando esta aula?</h2>
        <p id="attention-description">
          O vídeo está pausado e o progresso não avança enquanto aguardamos sua
          confirmação.
        </p>
        <p aria-live="polite">
          {phase === "expired"
            ? "Prazo encerrado. Confirme quando estiver pronto para retomar."
            : `${remaining} segundos para responder. Você poderá retornar depois.`}
        </p>
        <div className="learning-actions">
          <Button onClick={confirm}>Sim, continuar assistindo</Button>
          <Button
            variant="outline"
            onClick={() => {
              dialog.current?.close();
              setPhase("later");
            }}
          >
            Continuar depois
          </Button>
        </div>
      </dialog>
    </section>
  );
}
