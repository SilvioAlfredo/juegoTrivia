"""Capa repositorio: único lugar donde hay SQL de usuarios."""
from ..db import get_conn
from ..models.usuario import Usuario


class UsuarioRepository:
    @staticmethod
    def listar_top(limit: int = 50) -> list[Usuario]:
        conn = get_conn()
        try:
            rows = conn.execute(
                "SELECT id, nombre, edad, rol, puntuacion FROM usuarios "
                "ORDER BY puntuacion DESC, id ASC LIMIT ?",
                (limit,),
            ).fetchall()
            return [Usuario.from_row(r) for r in rows]
        finally:
            conn.close()

    @staticmethod
    def crear(nombre: str, edad: int, rol: str, puntuacion: int) -> Usuario:
        conn = get_conn()
        try:
            cursor = conn.execute(
                "INSERT INTO usuarios (nombre, edad, rol, puntuacion) "
                "VALUES (?, ?, ?, ?)",
                (nombre, edad, rol, puntuacion),
            )
            conn.commit()
            return Usuario(
                id=cursor.lastrowid,
                nombre=nombre,
                edad=edad,
                rol=rol,
                puntuacion=puntuacion,
            )
        finally:
            conn.close()
