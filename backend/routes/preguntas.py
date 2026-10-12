"""Capa controlador: rutas HTTP de preguntas."""
from flask import Blueprint, jsonify

from ..services.preguntas_service import PreguntasService

preguntas_bp = Blueprint("preguntas", __name__)


@preguntas_bp.route("/api/preguntas", methods=["GET"])
def obtener_preguntas():
    """Lista todas las preguntas de la trivia.
    ---
    tags:
      - Preguntas
    responses:
      200:
        description: Preguntas con tema, opciones e índice correcto.
        schema:
          type: array
          items:
            type: object
            properties:
              tema:
                type: string
                example: cpu
              question:
                type: string
                example: ¿Qué significa CPU?
              answers:
                type: array
                items:
                  type: string
              correct:
                type: integer
                example: 0
      500:
        description: preguntas.json no encontrado o error interno.
    """
    try:
        preguntas = PreguntasService.listar()
        return jsonify([p.to_dict() for p in preguntas]), 200
    except FileNotFoundError:
        return jsonify({"error": "preguntas.json no encontrado"}), 500
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
