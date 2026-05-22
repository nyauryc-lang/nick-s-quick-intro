import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <>
      <style>{`
        .hero-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 5rem 0;
        }
        .avatar {
          width: 150px; height: 150px;
          border-radius: 50%;
          background: white;
          color: #764ba2;
          font-size: 4rem;
          font-weight: bold;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.5rem;
          transition: transform .4s ease, box-shadow .4s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,.2);
        }
        .avatar:hover { transform: scale(1.1) rotate(5deg); box-shadow: 0 15px 40px rgba(0,0,0,.35); }
        .skill-card {
          transition: transform .3s ease, box-shadow .3s ease;
          border: none;
        }
        .skill-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(118,75,162,.25);
        }
        .btn-cta {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white; border: none;
          transition: transform .3s ease, box-shadow .3s ease;
        }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(118,75,162,.4); color: white; }
        .fade-up { animation: fadeUp .8s ease both; }
        @keyframes fadeUp { from{opacity:0; transform:translateY(20px);} to{opacity:1; transform:translateY(0);} }
        .badge-skill { transition: transform .2s ease; cursor: default; }
        .badge-skill:hover { transform: scale(1.15); }
      `}</style>

      <section className="hero-bg text-center">
        <div className="container fade-up">
          <div className="avatar">NY</div>
          <h1 className="display-3 fw-bold">Hola, soy Nick Yauri</h1>
          <p className="lead fs-4">Estudiante &amp; Desarrollador Web</p>
          <a href="#contacto" className="btn btn-light btn-lg mt-3 px-4 shadow">Conóceme más</a>
        </div>
      </section>

      <section className="container py-5">
        <div className="row justify-content-center text-center mb-5 fade-up">
          <div className="col-md-8">
            <h2 className="fw-bold mb-3">Sobre mí</h2>
            <p className="text-muted fs-5">
              Soy un apasionado por la tecnología, actualmente estudio y desarrollo
              aplicaciones web modernas. Me encanta aprender y crear cosas nuevas.
            </p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card skill-card h-100 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="display-4 mb-3">🎓</div>
                <h5 className="card-title fw-bold">Estudiante</h5>
                <p className="card-text text-muted">Siempre aprendiendo nuevas tecnologías y mejorando mis habilidades.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card skill-card h-100 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="display-4 mb-3">💻</div>
                <h5 className="card-title fw-bold">Desarrollador</h5>
                <p className="card-text text-muted">Creo aplicaciones web modernas, rápidas y atractivas.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card skill-card h-100 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="display-4 mb-3">🚀</div>
                <h5 className="card-title fw-bold">Creativo</h5>
                <p className="card-text text-muted">Convierto ideas en proyectos reales con dedicación y pasión.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="row justify-content-center mt-5">
          <div className="col-md-8 text-center">
            <h3 className="fw-bold mb-4">Habilidades</h3>
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {["HTML", "CSS", "JavaScript", "React", "Bootstrap", "Node.js", "Git"].map((s) => (
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
        <small>© 2026 Nick Yauri · Hecho con ❤️ y Bootstrap</small>
      </footer>
    </>
  );
}
