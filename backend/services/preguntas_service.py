"""Capa servicio: preguntas (sin validación de negocio compleja)."""
from ..models.pregunta import Pregunta
from ..repositories.preguntas_repository import PreguntasRepository


class PreguntasService:
    @staticmethod
    def listar() -> list[Pregunta]:
        return PreguntasRepository.listar()
