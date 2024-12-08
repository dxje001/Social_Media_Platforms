from app.blueprints.users.models import User
from sqlalchemy.orm import aliased
from sqlalchemy import or_
from app.app import db


class UserRepository:
    @staticmethod
    def get_all_users():
        return User.query.all()

    @staticmethod
    def get_all_blacklisted_users():
        return User.query.filter(User.RejectedPostCount > 3).all()

    @staticmethod
    def get_user_by_username(username):
        return User.query.filter_by(Username=username).first()

    @staticmethod
    def add_user(user):
        db.session.add(user)
        db.session.commit()

    @staticmethod
    def update_user(user):
        db.session.add(user)
        db.session.commit()

    @staticmethod
    def search_users(filter, username_id):

        return User.query.filter(
            or_(
                User.Name.ilike(f'%{filter}%'),
                User.Lastname.ilike(f'%{filter}%'),
                User.Username.ilike(f'%{filter}%'),
                User.Email.ilike(f'%{filter}%'),
                User.Address.ilike(f'%{filter}%'),
                User.City.ilike(f'%{filter}%'),
                User.State.ilike(f'%{filter}%'),
                User.PhoneNumber.ilike(f'%{filter}%')
            ),
            User.Username != username_id, # Exclude the user with the given username_id
            User.Username != "admin" # Exclude the user with the username admin
        ).all()

    @staticmethod
    def get_users_by_usernames(usernames):
        return User.query.filter(User.Username.in_(usernames)).all()
