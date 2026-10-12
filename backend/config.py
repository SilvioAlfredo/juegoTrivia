"""Configuración centralizada del backend (capa de configuración)."""
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Config:
    DB_PATH = os.environ.get("TRIVIA_DB_PATH", os.path.join(BASE_DIR, "datosDB.db"))
    PREGUNTAS_PATH = os.environ.get(
        "TRIVIA_PREGUNTAS_PATH", os.path.join(BASE_DIR, "preguntas.json")
    )
    PORT = int(os.environ.get("PORT", 5000))
    HOST = os.environ.get("HOST", "127.0.0.1")
    RANKING_LIMIT = 50
