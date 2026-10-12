"""Capa controlador: healthcheck."""
from flask import Blueprint, jsonify

health_bp = Blueprint("health", __name__)


@health_bp.route("/api/health", methods=["GET"])
def health():
    """Estado del servidor.
    ---
    tags:
      - Health
    responses:
      200:
        description: Servidor en funcionamiento.
        schema:
          type: object
          properties:
            status:
              type: string
              example: ok
    """
    return jsonify({"status": "ok"}), 200
