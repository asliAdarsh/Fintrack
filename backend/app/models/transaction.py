from .. import db
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    account_id = db.Column(db.Integer, db.ForeignKey('accounts.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    receipt_url = db.Column(db.String(255), nullable=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "account_id": self.account_id,
            "category_id": self.category_id,
            "amount": self.amount,
            "type": self.type,
            "title": self.title,
            "date": self.date.isoformat(),
            "receipt_url": self.receipt_url
        }
