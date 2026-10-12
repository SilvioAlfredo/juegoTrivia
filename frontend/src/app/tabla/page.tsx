'use client';

import { useEffect, useState } from "react";
import { getRanking, type Usuario } from "@/lib/api";

export default function TablaPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [estado, setEstado] = useState<"cargando" | "ok" | "error" | "vacia">("cargando");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    getRanking()
      .then((data) => {
        setUsuarios(data);
        setEstado(data.length === 0 ? "vacia" : "ok");
      })
      .catch((e: Error) => {
        setMensaje(e.message);
        setEstado("error");
      });
  }, []);

  if (estado === "cargando") return <section className="card"><p>Cargando tabla…</p></section>;

  if (estado === "error")
    return (
      <section className="card">
        <h1>No se pudo cargar la tabla</h1>
        <p className="error">{mensaje}</p>
        <p className="muted">Verificá que el backend esté corriendo en {process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000"}.</p>
      </section>
    );

  if (estado === "vacia")
    return (
      <section className="card">
        <h1>Tabla general</h1>
        <p className="muted">Todavía no hay puntajes guardados. Sé el primero en jugar.</p>
      </section>
    );

  return (
    <section className="card wide">
      <h1>Tabla general</h1>
      <p className="muted">Top {usuarios.length} por puntuación.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Rol</th>
              <th>Puntuación</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => (
              <tr key={u.id} className={i < 3 ? `top-${i + 1}` : undefined}>
                <td>{i + 1}</td>
                <td>{u.nombre}</td>
                <td>{u.edad}</td>
                <td>{u.rol}</td>
                <td className="num">{u.puntuacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
