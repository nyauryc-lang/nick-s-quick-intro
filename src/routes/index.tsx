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
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="display-4">Hola, soy Nick Yauri</h1>
          <h2 className="text-muted">Estudiante y Desarrollador</h2>
          <p className="lead">Bienvenido a mi página de presentación.</p>

          <h3 className="mt-4">Sobre mí</h3>
          <ul className="list-group mb-4">
            <li className="list-group-item"><strong>Nombre:</strong> Nick Yauri</li>
            <li className="list-group-item"><strong>Ocupación:</strong> Estudiante</li>
            <li className="list-group-item"><strong>Profesión:</strong> Desarrollador</li>
          </ul>

          <h3>¿Qué hago?</h3>
          <p>Estudio y desarrollo aplicaciones web.</p>

          <button className="btn btn-primary">Contáctame</button>
        </div>
      </div>
    </main>
  );
}
