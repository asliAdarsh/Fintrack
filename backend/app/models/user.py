from .. import db
from datetime import datetime
import bcrypt

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    profile_image = db.Column(db.String(255), nullable=True)
    theme_preference = db.Column(db.String(20), default='light')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    categories = db.relationship('Category', backref='user', lazy=True, cascade="all, delete-orphan")
    accounts = db.relationship('Account', backref='user', lazy=True, cascade="all, delete-orphan")
    transactions = db.relationship('Transaction', backref='user', lazy=True, cascade="all, delete-orphan")
    budgets = db.relationship('Budget', backref='user', lazy=True, cascade="all, delete-orphan")
    loans = db.relationship('Loan', backref='user', lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "profile_image": self.profile_image,
            "theme_preference": self.theme_preference,
            "created_at": self.created_at.isoformat()
        }
