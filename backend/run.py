"""Punto de entrada del servidor.

Funciona de ambas formas (desde la raíz del proyecto):

    python -m backend.run   # como módulo (recomendado)
    python backend/run.py   # como script
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app
from backend.config import Config

app = create_app()

if __name__ == "__main__":
    app.run(host=Config.HOST, port=Config.PORT, debug=True)
