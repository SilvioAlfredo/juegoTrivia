"""Capa controlador: rutas HTTP de usuarios (sin SQL ni reglas de negocio)."""
from flask import Blueprint, jsonify, request

from ..config import Config
from ..services.usuario_service import UsuarioService, ValidationError

usuarios_bp = Blueprint("usuarios", __name__)


@usuarios_bp.route("/api/usuarios", methods=["GET"])
def obtener_usuarios():
    """Ranking de usuarios por puntuación.
    ---
    tags:
      - Usuarios
    responses:
      200:
        description: Top de usuarios ordenado por puntuación descendente.
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
                example: 2
              nombre:
                type: string
                example: Myriam
              edad:
                type: integer
                example: 55
              rol:
                type: string
                example: Mamá
              puntuacion:
                type: integer
                example: 240
      500:
        description: Error interno del servidor.
    """
    try:
        usuarios = UsuarioService.ranking(Config.RANKING_LIMIT)
        return jsonify([u.to_dict() for u in usuarios]), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500


@usuarios_bp.route("/api/usuarios", methods=["POST"])
def insertar_usuario():
    """Registra el resultado de un jugador.
    ---
    tags:
      - Usuarios
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [nombre, edad, rol, puntuacion]
          properties:
            nombre:
              type: string
              example: Alfredo
            edad:
              type: integer
              example: 30
            rol:
              type: string
              example: Estudiante
            puntuacion:
              type: integer
              example: 120
              description: Acepta 0 (partida sin aciertos).
    responses:
      201:
        description: Usuario insertado correctamente.
        schema:
          type: object
          properties:
            message:
              type: string
              example: Usuario insertado correctamente
            id:
              type: integer
              example: 10
      400:
        description: Datos faltantes o inválidos.
      500:
        description: Error interno del servidor.
    """
    try:
        data = request.get_json(force=True, silent=True) or {}
        usuario = UsuarioService.registrar(data)
        return (
            jsonify({"message": "Usuario insertado correctamente", "id": usuario.id}),
            201,
        )
    except ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
