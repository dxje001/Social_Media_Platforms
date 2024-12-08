from app.app import db
import uuid
from sqlalchemy import Column, Integer, String

class Relationships(db.Model):
    __tablename__ = 'relationships'

    Id = db.Column(db.String(255), primary_key=True, default=lambda: str(uuid.uuid4()))
    Requester_id = db.Column(db.String(255), db.ForeignKey('users.Username'), nullable=False)
    Receiver_id = db.Column(db.String(255), db.ForeignKey('users.Username'), nullable=False)
    Status = db.Column(db.String(50), nullable=False, default='pending')  # pending, accepted, rejected

    def __repr__(self):
        return f"<Relationships {self.Requester_id} -> {self.Receiver_id}, Status: {self.Status}>"

