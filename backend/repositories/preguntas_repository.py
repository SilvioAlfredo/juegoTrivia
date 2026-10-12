"""Capa repositorio: lectura de preguntas (JSON estático)."""
import json

from ..config import Config
from ..models.pregunta import Pregunta


class PreguntasRepository:
    @staticmethod
    def listar() -> list[Pregunta]:
        with open(Config.PREGUNTAS_PATH, encoding="utf-8") as f:
            data = json.load(f)
        return [Pregunta(**p) for p in data]
