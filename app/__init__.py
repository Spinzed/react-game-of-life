from flask import Flask
from .routes import handlers

def create_app():
    app = Flask(__name__)
    app.register_blueprint(handlers)
    return app