"""Capa de dominio: entidad Pregunta."""
from dataclasses import asdict, dataclass


@dataclass
class Pregunta:
    tema: str
    question: str
    answers: list
    correct: int

    def to_dict(self) -> dict:
        return asdict(self)
