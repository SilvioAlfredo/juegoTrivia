'use client';

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getPreguntas,
  registrarResultado,
  seleccionarPreguntas,
  type Jugador,
  type Pregunta,
} from "@/lib/api";

const PUNTOS_POR_ACIERTO = 20;

export default function JuegoPage() {
  const router = useRouter();
  const [jugador] = useState<Jugador | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("trivia-jugador");
    return raw ? (JSON.parse(raw) as Jugador) : null;
  });
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [indice, setIndice] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [estado, setEstado] = useState<"cargando" | "jugando" | "guardando" | "fin" | "error">(
    "cargando"
  );
  const [mensaje, setMensaje] = useState("");
  const [feedback, setFeedback] = useState("");
  // Bloquea los botones mientras se muestra el feedback: evita que un
  // doble clic invoque responder() dos veces y salte/finalice preguntas.
  const [bloqueado, setBloqueado] = useState(false);
  // Fuente de verdad del puntaje (sincrónica): evita cierres obsoletos.
  const aciertosRef = useRef(0);

  useEffect(() => {
    if (jugador === null) {
      router.replace("/");
      return;
    }
    getPreguntas()
      .then((todas) => {
        const elegidas = seleccionarPreguntas(todas, 3);
        if (elegidas.length === 0) throw new Error("No hay preguntas disponibles.");
        setPreguntas(elegidas);
        setEstado("jugando");
      })
      .catch((e: Error) => {
        setMensaje(e.message);
        setEstado("error");
      });
  }, [router, jugador]);

  const actual = useMemo(() => preguntas[indice], [preguntas, indice]);
  const fin = estado === "fin" || (estado === "jugando" && indice >= preguntas.length);

  async function responder(i: number) {
    if (!actual || bloqueado) return;
    setBloqueado(true);
    const acierto = i === actual.correct;
    if (acierto) {
      aciertosRef.current += 1;
      setPuntos(aciertosRef.current * PUNTOS_POR_ACIERTO);
      setFeedback("¡Correcto! +20 puntos");
    } else {
      setFeedback(`Incorrecto. Era: ${actual.answers[actual.correct]}`);
    }
    await new Promise((r) => setTimeout(r, 650));
    setFeedback("");
    if (indice + 1 >= preguntas.length) {
      // Partida completa: recién acá se contabiliza y persiste el total.
      await finalizar(aciertosRef.current * PUNTOS_POR_ACIERTO);
    } else {
      setIndice((v) => v + 1);
      setBloqueado(false);
    }
  }

  async function finalizar(total: number) {
    if (!jugador) return;
    setEstado("guardando");
    try {
      await registrarResultado(jugador, total);
      setEstado("fin");
    } catch (e) {
      setMensaje(e instanceof Error ? e.message : "No se pudo guardar el puntaje.");
      setEstado("fin");
    }
  }

  if (estado === "cargando" || estado === "guardando")
    return <section className="card"><p>Cargando…</p></section>;

  if (estado === "error")
    return (
      <section className="card">
        <h1>Sin conexión con el servidor</h1>
        <p className="error">{mensaje}</p>
        <p className="muted">Iniciá el backend: <code>python -m backend.run</code></p>
      </section>
    );

  if (fin)
    return (
      <section className="card">
        <h1>¡Fin del juego!</h1>
        <p className="score">Puntuación: {puntos}</p>
        {mensaje && <p className="error">{mensaje}</p>}
        <div className="row">
          <button className="btn" onClick={() => router.push("/tabla")}>
            Ver tabla general
          </button>
          <button className="btn secondary" onClick={() => router.push("/")}>
            Jugar de nuevo
          </button>
        </div>
      </section>
    );

  if (!actual) return null;

  return (
    <section className="card">
      <p className="muted">
        Pregunta {indice + 1} de {preguntas.length} · {actual.tema} · Puntos: {puntos}
      </p>
      <h1 className="question">{actual.question}</h1>
      <div className="answers">
        {actual.answers.map((r, i) => (
          <button
            key={i}
            className="btn answer"
            disabled={bloqueado}
            onClick={() => responder(i)}
          >
            {r}
          </button>
        ))}
      </div>
      {feedback && <p className="feedback">{feedback}</p>}
    </section>
  );
}
