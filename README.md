# TriviaESC — Juego de trivia educativo

Juego de preguntas y respuestas con enfoque educativo (CPU, RAM, GPU y
almacenamiento), organizado en **modelo cliente-servidor**:

- **Servidor**: API REST en **Flask** con arquitectura en capas y SQLite.
- **Cliente**: aplicación **Next.js** (App Router) con registro, quiz y tabla general.

Las preguntas estáticas viven en `preguntas.json`; los datos dinámicos
(usuarios y puntajes) persisten en `datosDB.db` (SQLite).

## Arquitectura

```
┌─────────────┐  HTTP/JSON   ┌──────────────────────────┐
│   CLIENTE   │ ───────────► │         SERVIDOR         │
│   Next.js   │ ◄─────────── │     Flask en capas       │
│  :3000      │              │     :5000                │
└─────────────┘              └──────────────────────────┘
```

### Backend `backend/` — capas (las dependencias van hacia adentro)

| Capa | Carpeta/archivo | Responsabilidad |
|---|---|---|
| Controlador | `routes/` | Solo HTTP: `usuarios.py`, `preguntas.py`, `health.py`. Sin SQL ni reglas de negocio |
| Servicio | `services/` | Validación y reglas (`usuario_service.py`, `preguntas_service.py`) |
| Repositorio | `repositories/` | Único lugar con SQL/JSON (`usuario_repository.py`, `preguntas_repository.py`) |
| Dominio | `models/usuario.py`, `models/pregunta.py` | Entidades `Usuario` y `Pregunta` |
| Datos | `db.py` | Conexión SQLite + `init_db()` |
| Configuración | `config.py`, `app.py`, `run.py` | Rutas, puerto, factory `create_app()` |
| Utilidad | `export_spec.py` | Exporta el spec Swagger a `docs/swagger/` |

Regla: `routes → services → repositories → db`. Ninguna capa interna
importa a una externa.

### Frontend `frontend/` — Next.js 16 (App Router)

| Ruta | Archivo | Descripción |
|---|---|---|
| `/` | `src/app/page.tsx` | Registro (nombre, edad, rol) → guarda en `localStorage` |
| `/juego` | `src/app/juego/page.tsx` | Quiz: 3 preguntas aleatorias por tema, +20 por acierto, guarda el resultado |
| `/tabla` | `src/app/tabla/page.tsx` | Tabla general con estados de carga / vacía / error |

Todo el acceso a la API está centralizado y documentado con **JSDoc** en
`src/lib/api.ts` (`getPreguntas`, `getRanking`, `registrarResultado`,
`seleccionarPreguntas`). La URL del servidor se configura con
`NEXT_PUBLIC_API_URL` (ver `frontend/.env.example`; el `.env.local` no se
versiona).

## API REST + Swagger

Documentación interactiva (Swagger UI, vía Flasgger):

- **http://127.0.0.1:5000/apidocs** (con el backend corriendo)

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Healthcheck → `{status: "ok"}` |
| GET | `/api/preguntas` | 20 preguntas desde `preguntas.json` |
| GET | `/api/usuarios` | Ranking top 50 por puntuación descendente |
| POST | `/api/usuarios` | `{nombre, edad, rol, puntuacion}` → `201` + `{message, id}` |

Ejemplo:

```bash
curl -X POST http://127.0.0.1:5000/api/usuarios \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Alfredo","edad":30,"rol":"Estudiante","puntuacion":120}'
```

## Documentación generada (Swagger + JSDoc)

Los artefactos generados viven en `docs/` y están **ignorados por git**
(ver `.gitignore`); se regeneran con:

```bash
# Swagger: spec OpenAPI en docs/swagger/openapi.json
python backend/export_spec.py

# JSDoc: sitio HTML en docs/api/ (TypeDoc sobre src/lib/api.ts)
cd frontend && npm run docs
```

En vivo: Swagger UI en http://127.0.0.1:5000/apidocs (backend corriendo).

## Gitignore

`.gitignore` (raíz) + `frontend/.gitignore` cubren: `__pycache__/`
y `*.pyc`, entornos virtuales, `*.db` (la base se regenera con
`init_db()` al arrancar), `node_modules/`, `.next/`, `.env*` locales,
`docs/` generado, logs y archivos de SO/IDEs. `frontend/.env.example`
es la plantilla versionada para crear el `.env.local`.

## Cómo correr

Terminal 1 — servidor (http://127.0.0.1:5000):

```bash
cd juegoTrivia
pip install -r backend/requirements.txt
python -m backend.run   # o bien: python backend/run.py
```

Terminal 2 — cliente (http://localhost:3000):

```bash
cd juegoTrivia/frontend
npm install
npm run dev
```

Variables de entorno:

| Variable | Dónde | Por defecto | Descripción |
|---|---|---|---|
| `PORT` / `HOST` | backend | `5000` / `127.0.0.1` | Escucha del servidor |
| `TRIVIA_DB_PATH` | backend | `datosDB.db` | Ruta del SQLite |
| `TRIVIA_PREGUNTAS_PATH` | backend | `preguntas.json` | Ruta de preguntas |
| `NEXT_PUBLIC_API_URL` | frontend | `http://127.0.0.1:5000` | URL de la API |

Punto de entrada del servidor: `python -m backend.run` (o bien
`python backend/run.py`) desde la raíz del proyecto. Los archivos vanilla
originales fueron retirados al migrar el cliente a Next.js (recuperables
en el historial git).

## Correcciones aplicadas en la modernización

- `puntuacion: 0` ahora se persiste (antes `if not puntuacion` la rechazaba
  en el backend y en `insertarUsuario.js`).
- Sin `UnboundLocalError`: conexiones centralizadas en `db.py` con ruta absoluta.
- Validación con códigos correctos (400 vs 500) y rangos (`edad` 1-120).
- Cliente sin URLs quemadas ni rutas relativas frágiles: todo pasa por
  `src/lib/api.ts` + `NEXT_PUBLIC_API_URL`.
- Tabla con estados de carga / vacía / error y orden `puntuacion DESC`.
