'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Jugador } from "@/lib/api";

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState<Jugador>({ nombre: "", edad: 0, rol: "" });
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) return setError("Ingresá tu nombre.");
    if (!form.edad || form.edad < 1 || form.edad > 120)
      return setError("Ingresá una edad válida (1-120).");
    if (!form.rol.trim()) return setError("Ingresá tu rol.");
    setError("");
    localStorage.setItem("trivia-jugador", JSON.stringify(form));
    router.push("/juego");
  }

  return (
    <section className="card">
      <h1>¡Bienvenidos!</h1>
      <p className="muted">Registrate para empezar la trivia.</p>
      <form onSubmit={onSubmit} className="form">
        <label>
          Nombre
          <input
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Nombre"
            required
          />
        </label>
        <label>
          Edad
          <input
            type="number"
            min={1}
            max={120}
            value={form.edad || ""}
            onChange={(e) => setForm({ ...form, edad: Number(e.target.value) })}
            placeholder="Edad"
            required
          />
        </label>
        <label>
          Rol
          <input
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            placeholder="Rol (p. ej. Estudiante)"
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn">
          Empezar
        </button>
      </form>
    </section>
  );
}
