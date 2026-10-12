/**
 * Cliente HTTP de TriviaESC: único módulo del frontend que habla con la API Flask.
 *
 * Toda la comunicación cliente → servidor pasa por aquí para no repetir
 * la URL base ni el manejo de errores en cada página.
 *
 * @module lib/api
 */

/** URL base de la API Flask. Se configura con `NEXT_PUBLIC_API_URL`. */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

/**
 * Fila de la tabla `usuarios` tal como la devuelve `GET /api/usuarios`.
 */
export interface Usuario {
  /** Clave primaria autoincremental. */
  id: number;
  /** Nombre del jugador. */
  nombre: string;
  /** Edad del jugador (1-120). */
  edad: number;
  /** Rol declarado (p. ej. "Estudiante"). */
  rol: string;
  /** Puntaje total de la partida (20 por acierto, 0 válido). */
  puntuacion: number;
}

/**
 * Pregunta de la trivia tal como la devuelve `GET /api/preguntas`.
 */
export interface Pregunta {
  /** Tema en minúsculas (`cpu`, `ram`, `gpu`, `almacenamiento`). */
  tema: string;
  /** Enunciado de la pregunta. */
  question: string;
  /** Opciones de respuesta. */
  answers: string[];
  /** Índice de la respuesta correcta dentro de `answers`. */
  correct: number;
}

/**
 * Datos del jugador registrados en el formulario y guardados en
 * `localStorage` bajo la clave `trivia-jugador`.
 */
export interface Jugador {
  nombre: string;
  edad: number;
  rol: string;
}

/**
 * Valida una respuesta `fetch` y la convierte a JSON tipado.
 *
 * @typeParam T - Forma esperada del cuerpo JSON.
 * @param res - Respuesta HTTP a procesar.
 * @returns El cuerpo parseado como `T`.
 * @throws {Error} Si el estado no es 2xx, con el `error` del backend.
 */
async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `Error HTTP ${res.status}`
    );
  }
  return res.json() as Promise<T>;
}

/**
 * Obtiene las 20 preguntas desde el servidor (sin caché).
 *
 * @returns Lista completa de preguntas.
 */
export function getPreguntas(): Promise<Pregunta[]> {
  return fetch(`${API_URL}/api/preguntas`, { cache: "no-store" }).then(handle<Pregunta[]>);
}

/**
 * Obtiene el ranking de puntajes ordenado de mayor a menor.
 *
 * @returns Top de usuarios (límite configurado en el backend).
 */
export function getRanking(): Promise<Usuario[]> {
  return fetch(`${API_URL}/api/usuarios`, { cache: "no-store" }).then(handle<Usuario[]>);
}

/**
 * Persiste el resultado de una partida en el servidor.
 *
 * @param jugador - Datos del jugador (nombre, edad, rol).
 * @param puntuacion - Puntaje total; `0` es válido (sin aciertos).
 * @returns Mensaje de confirmación y `id` de la fila creada.
 */
export function registrarResultado(
  jugador: Jugador,
  puntuacion: number
): Promise<{ message: string; id: number }> {
  return fetch(`${API_URL}/api/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...jugador, puntuacion }),
  }).then(handle<{ message: string; id: number }>);
}

/**
 * Elige `porTema` preguntas aleatorias de cada tema, sin repetir,
 * y mezcla el orden final para la partida.
 *
 * @param todas - Preguntas disponibles (normalmente de {@link getPreguntas}).
 * @param porTema - Cantidad a elegir por tema (por defecto 3).
 * @returns Preguntas seleccionadas y mezcladas.
 */
export function seleccionarPreguntas(todas: Pregunta[], porTema = 3): Pregunta[] {
  const grupos = new Map<string, Pregunta[]>();
  for (const p of todas) {
    const key = p.tema.toLowerCase();
    if (!grupos.has(key)) grupos.set(key, []);
    grupos.get(key)!.push(p);
  }
  const elegidas: Pregunta[] = [];
  for (const lista of grupos.values()) {
    const copia = [...lista];
    const n = Math.min(porTema, copia.length);
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * copia.length);
      elegidas.push(copia.splice(idx, 1)[0]);
    }
  }
  // Mezclar orden final
  for (let i = elegidas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [elegidas[i], elegidas[j]] = [elegidas[j], elegidas[i]];
  }
  return elegidas;
}
