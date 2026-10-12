"""Factory de la aplicación Flask: ensambla las capas."""
from flasgger import Swagger
from flask import Flask
from flask_cors import CORS

from .config import Config
from .db import init_db
from .routes.health import health_bp
from .routes.preguntas import preguntas_bp
from .routes.usuarios import usuarios_bp

SWAGGER_TEMPLATE = {
    "info": {
        "title": "TriviaESC API",
        "description": "API del juego de trivia educativo (usuarios y preguntas).",
        "version": "1.0.0",
    },
    "basePath": "/",
    "schemes": ["http"],
}


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)
    Swagger(app, template=SWAGGER_TEMPLATE)

    app.register_blueprint(health_bp)
    app.register_blueprint(preguntas_bp)
    app.register_blueprint(usuarios_bp)

    init_db()
    return app


app = create_app()


if __name__ == "__main__":
    app.run(host=Config.HOST, port=Config.PORT, debug=True)
