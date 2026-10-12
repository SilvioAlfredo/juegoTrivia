"""Exporta el spec OpenAPI (Swagger) a docs/swagger/openapi.json.

Uso desde la raíz del proyecto:

    python backend/export_spec.py

El archivo generado está ignorado por git (ver .gitignore: docs/);
la UI en vivo siempre está en http://127.0.0.1:5000/apidocs.
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.app import create_app

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "docs", "swagger", "openapi.json")


def main() -> None:
    app = create_app()
    spec = app.test_client().get("/apispec_1.json").get_json()
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(spec, f, indent=2, ensure_ascii=False)
    print(f"spec -> {OUT} ({len(spec.get('paths', {}))} paths)")


if __name__ == "__main__":
    main()
