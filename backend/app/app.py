from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_mail import Mail
from flask_socketio import SocketIO
import os

# Initialize the database
db = SQLAlchemy()
mail = Mail()
socketio = SocketIO(cors_allowed_origins="http://localhost:4200")

def create_app():
    app = Flask(__name__, template_folder='templates')

    # Configure SQLAlchemy (MySQL database)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://app_user:Pass1234@127.0.0.1/social_media_'
    app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads', 'images')

    app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

    # Mail configuration
    app.config['MAIL_SERVER'] = 'smtp.gmail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL '] = False
    app.config['MAIL_USERNAME'] = 'sreckomarinkovic000@gmail.com'  # Postavite vaš email
    app.config['MAIL_PASSWORD'] = 'ovojesifra123'  # Postavite vašu lozinku
    app.config['MAIL_DEFAULT_SENDER'] = 'sreckomarinkovic000@gmail.com'

    db.init_app(app)
    mail.init_app(app)

    # Initialize Socket.IO with CORS support
    socketio.init_app(app, cors_allowed_origins="http://localhost:4200")
    CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

    # Register blueprints
    from app.blueprints.users.routes import users_bp
    app.register_blueprint(users_bp, url_prefix='/user')

    from app.blueprints.posts.routes import posts_bp
    app.register_blueprint(posts_bp, url_prefix='/post')

    from app.blueprints.relationships.routes import relationships_bp
    app.register_blueprint(relationships_bp, url_prefix='/relationships')

    migrate = Migrate(app, db)

    return app

if __name__ == "__main__":
    app = create_app()
    socketio.run(app, debug=True)
