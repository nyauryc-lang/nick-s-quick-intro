import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Nick Yauri - Desarrollador" },
      { name: "description", content: "Nick Yauri, estudiante y desarrollador." },
    ],
  }),
});

function Index() {
  return (
    <div>
      <h1>Nick Yauri</h1>
      <h2>Estudiante y Desarrollador</h2>
      <p>Hola, soy Nick Yauri. Actualmente estudio y trabajo como desarrollador.</p>

      <h3>Sobre mi</h3>
      <ul>
        <li>Nombre: Nick Yauri</li>
        <li>Ocupacion: Estudiante</li>
        <li>Profesion: Desarrollador</li>
      </ul>

      <h3>Que hago</h3>
      <p>Me dedico al desarrollo de software y sigo aprendiendo cada dia.</p>
    </div>
  );
}
