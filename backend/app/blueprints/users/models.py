from app.app import db
from sqlalchemy import Column, Integer, String


class User(db.Model):
    __tablename__ = 'users'

    Username = db.Column(db.String(255), primary_key = True)
    Name = db.Column(db.String(255), nullable=False)
    Lastname = db.Column(db.String(255), nullable=False)
    Password = db.Column(db.String(255), nullable=False)
    Email = db.Column(db.String(255), nullable=False)
    Address = db.Column(db.String(255), nullable=False)
    City = db.Column(db.String(255), nullable=False)
    State = db.Column(db.String(255), nullable=False)
    PhoneNumber = db.Column(db.String(255), nullable=False)
    IsAdmin = db.Column(db.String(255), nullable=False, default="no")
    IsNewUser = db.Column(db.String(255), nullable=False, default="yes")
    RejectedPostCount = db.Column(db.Integer, nullable=False, default=0)

    def __repr__(self):
        return  f"<Username {self.Username}, Name: {self.Name}>"

    def get_username(self):
        return self.Username