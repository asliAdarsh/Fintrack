from .. import db
from datetime import datetime

class Loan(db.Model):
    __tablename__ = 'loans'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    person_name = db.Column(db.String(150), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(20), nullable=False)
    due_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='Unpaid')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "person_name": self.person_name,
            "amount": self.amount,
            "type": self.type,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }
