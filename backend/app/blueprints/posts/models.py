from email.policy import default
import uuid
from app.app import db
from datetime import datetime
from sqlalchemy import Column, Integer, String


class Post(db.Model):
    __tablename__ = 'posts'

    ID = db.Column(db.String(255), primary_key=True)
    Username = db.Column(db.String(255), nullable=False)
    Txt = db.Column(db.String(255), nullable=True)
    ImagePath = db.Column(db.String(255), nullable=True)
    Approved = db.Column(db.String(255), nullable=False, default="no")      #yes, no, rejected
    CreatedAt = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)


    def __repr__(self):
        return  f"<Username {self.Username}>"

    def get_id(self):
        return self.ID