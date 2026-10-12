"""Capa de dominio: entidad Usuario."""
from dataclasses import asdict, dataclass


@dataclass
class Usuario:
    id: int | None
    nombre: str
    edad: int
    rol: str
    puntuacion: int

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_row(cls, row) -> "Usuario":
        return cls(
            id=row["id"],
            nombre=row["nombre"],
            edad=row["edad"],
            rol=row["rol"],
            puntuacion=row["puntuacion"],
        )
