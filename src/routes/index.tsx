import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nick Yauri - Desarrollador" },
      { name: "description", content: "Presentación de Nick Yauri, estudiante y desarrollador." },
    ],
  }),
  component: Index,
});

function Index() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    import("@/lib/wreckingBall").then(({ mountWreckingBall }) => {
      if (cancelled || !canvasRef.current) return;
      mountWreckingBall(canvasRef.current, resetRef.current).then((c) => {
        if (cancelled) c();
        else cleanup = c;
      });
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <>
      <style>{`
        .hero-stage {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background:
            conic-gradient(rgba(255,255,255,.1) 90deg, transparent 90deg 180deg, rgba(255,255,255,.1) 180deg 270deg, transparent 270deg),
            linear-gradient(110deg, #4a6dff 0%, #7d3ad1 100%);
          background-size: 40px 40px, 100% 100%;
          user-select: none;
        }
        .hero-stage canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; touch-action: none; }
        .hero-overlay {
          position: absolute; top: 0; left: 0; right: 0;
          z-index: 5; padding: 4rem 1rem 0; text-align: center; color: white;
          pointer-events: none;
          text-shadow: 0 4px 20px rgba(0,0,0,.4);
        }
        .hero-overlay .avatar {
          width: 110px; height: 110px; border-radius: 50%;
          background: white; color: #7d3ad1;
          font-size: 2.8rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 10px 30px rgba(0,0,0,.35);
          pointer-events: auto;
          transition: transform .4s ease;
        }
        .hero-overlay .avatar:hover { transform: scale(1.1) rotate(5deg); }
        .hero-hint {
          position: absolute; bottom: 24px; left: 0; right: 0;
          z-index: 5; text-align: center; color: rgba(255,255,255,.85);
          font-size: .9rem; letter-spacing: .08em; text-transform: uppercase;
          pointer-events: none; animation: bounce 2s infinite;
        }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        #reset-btn {
          position: absolute; top: 24px; right: 24px; z-index: 10;
          display: inline-flex; align-items: center; gap: 6px;
          height: 36px; padding: 0 14px 0 10px; border-radius: 18px;
          background: rgba(0,0,0,.35); border: 1px solid rgba(255,255,255,.15);
          backdrop-filter: blur(8px); cursor: pointer;
          color: rgba(255,255,255,.75); font-size: 12px; font-weight: 500;
          letter-spacing: .04em; text-transform: uppercase;
          transition: background .15s ease, transform .15s ease, color .15s ease;
        }
        #reset-btn svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; transition: transform .4s cubic-bezier(.34,1.56,.64,1); }
        #reset-btn:hover { background: #7be3ff; color: #0a0a0a; }
        #reset-btn:hover svg { transform: rotate(180deg); }
        #reset-btn:active { transform: scale(.92); }

        .skill-card { transition: transform .3s ease, box-shadow .3s ease; border: none; }
        .skill-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(125,58,209,.25); }
        .btn-cta { background: linear-gradient(135deg, #4a6dff 0%, #7d3ad1 100%); color: white; border: none; transition: transform .3s ease, box-shadow .3s ease; }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(125,58,209,.4); color: white; }
        .badge-skill { transition: transform .2s ease; cursor: default; }
        .badge-skill:hover { transform: scale(1.15); }
        .fade-up { animation: fadeUp .8s ease both; }
        @keyframes fadeUp { from{opacity:0; transform:translateY(20px);} to{opacity:1; transform:translateY(0);} }
      `}</style>

      <section className="hero-stage">
        <canvas ref={canvasRef} id="stage" />
        <button ref={resetRef} id="reset-btn" type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Reset</span>
        </button>
        <div className="hero-overlay">
          <div className="avatar">NY</div>
          <h1 className="display-3 fw-bold">Hola, soy Nick Yauri</h1>
          <p className="lead fs-4">Estudiante &amp; Desarrollador Web</p>
        </div>
        <div className="hero-hint">↓ Arrastra la bola y derriba la torre · Desplázate para conocerme</div>
      </section>

      <section className="container py-5">
        <div className="row justify-content-center text-center mb-5 fade-up">
          <div className="col-md-8">
            <h2 className="fw-bold mb-3">Sobre mí</h2>
            <p className="text-muted fs-5">
              Soy un apasionado por la tecnología, actualmente estudio y desarrollo aplicaciones web modernas.
              Me encanta aprender y crear cosas nuevas... ¡como una bola de demolición con física real!
            </p>
          </div>
        </div>

        <div className="row g-4">
          {[
            { i: "🎓", t: "Estudiante", d: "Siempre aprendiendo nuevas tecnologías y mejorando mis habilidades." },
            { i: "💻", t: "Desarrollador", d: "Creo aplicaciones web modernas, rápidas y atractivas." },
            { i: "🚀", t: "Creativo", d: "Convierto ideas en proyectos reales con dedicación y pasión." },
          ].map((c) => (
            <div className="col-md-4" key={c.t}>
              <div className="card skill-card h-100 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3">{c.i}</div>
                  <h5 className="card-title fw-bold">{c.t}</h5>
                  <p className="card-text text-muted">{c.d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-md-8 text-center">
            <h3 className="fw-bold mb-4">Habilidades</h3>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {["HTML", "CSS", "JavaScript", "React", "Bootstrap", "Node.js", "Git", "Matter.js"].map((s) => (
                <span key={s} className="badge bg-primary fs-6 p-2 badge-skill">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div id="contacto" className="row justify-content-center mt-5 pt-4">
          <div className="col-md-6 text-center">
            <h3 className="fw-bold mb-3">¿Trabajamos juntos?</h3>
            <p className="text-muted">Estoy disponible para nuevos proyectos y oportunidades.</p>
            <button className="btn btn-cta btn-lg px-5 py-3 fw-bold">Contáctame</button>
          </div>
        </div>
      </section>

      <footer className="text-center py-4 text-muted">
        <small>© 2026 Nick Yauri · Hecho con ❤️, Bootstrap y Matter.js</small>
      </footer>
    </>
  );
}
