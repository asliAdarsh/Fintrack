import os
from .config import get_config
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app(config_name="development"):
    app = Flask(__name__)
    
    app.config.from_object(get_config(config_name))
    
    CORS(app)
    db.init_app(app)
    
    from .routes.auth_routes import auth_bp
    from .routes.transaction_routes import transaction_bp
    from .routes.category_routes import category_bp
    from .routes.account_routes import account_bp
    from .routes.budget_routes import budget_bp
    from .routes.loan_routes import loan_bp
    from .routes.analytics_routes import analytics_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(transaction_bp, url_prefix='/api/transactions')
    app.register_blueprint(category_bp, url_prefix='/api/categories')
    app.register_blueprint(account_bp, url_prefix='/api/accounts')
    app.register_blueprint(budget_bp, url_prefix='/api/budgets')
    app.register_blueprint(loan_bp, url_prefix='/api/loans')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    
    with app.app_context():
        db.create_all()
        
    return app
