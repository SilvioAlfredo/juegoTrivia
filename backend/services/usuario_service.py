"""Capa servicio: reglas de negocio y validación de usuarios."""
from ..models.usuario import Usuario
from ..repositories.usuario_repository import UsuarioRepository


class ValidationError(ValueError):
    pass


class UsuarioService:
    @staticmethod
    def validar(nombre, edad, rol, puntuacion) -> tuple[str, int, str, int]:
        if not isinstance(nombre, str) or not nombre.strip():
            raise ValidationError("Campo 'nombre' requerido")
        if edad is None or (isinstance(edad, str) and not edad.strip()):
            raise ValidationError("Campo 'edad' requerido")
        if not isinstance(rol, str) or not rol.strip():
            raise ValidationError("Campo 'rol' requerido")
        if puntuacion is None:
            # puntuacion == 0 es válida: no usar `if not puntuacion`
            raise ValidationError("Campo 'puntuacion' requerido")

        try:
            edad = int(edad)
            puntuacion = int(puntuacion)
        except (TypeError, ValueError):
            raise ValidationError("'edad' y 'puntuacion' deben ser números")

        if edad < 1 or edad > 120:
            raise ValidationError("'edad' fuera de rango (1-120)")
        if puntuacion < 0:
            raise ValidationError("'puntuacion' no puede ser negativa")

        return nombre.strip(), edad, rol.strip(), puntuacion

    @classmethod
    def registrar(cls, data: dict) -> Usuario:
        nombre, edad, rol, puntuacion = cls.validar(
            data.get("nombre"), data.get("edad"), data.get("rol"), data.get("puntuacion")
        )
        return UsuarioRepository.crear(nombre, edad, rol, puntuacion)

    @staticmethod
    def ranking(limit: int = 50) -> list[Usuario]:
        return UsuarioRepository.listar_top(limit)
