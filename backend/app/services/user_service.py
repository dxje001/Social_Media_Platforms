import jwt
import datetime
from app.repositories.user_repository import UserRepository
from app.repositories.relationships_repository import RelationshipsRepository
from app.blueprints.users.models import User
from flask_mail import Message
from app.app import mail
import threading

SECRET_KEY = 'your_secret_key_here'

def send_email_task(app,email, username, password):
    with app.app_context():  # Push the application context
        msg = Message(
            'Welcome to Our Social Media Platform',
            recipients=[email]
        )
        msg.body = f"""
        Hi {username},

        Welcome to our social media platform! Here are your login details:

        Username: {username}
        Password: {password}

        Please keep this information safe.

        Best regards,
        Your Admin
        """
        mail.send(msg)

def send_email_task_to_admin(app, username):
    with app.app_context():  # Push the application context
        msg = Message(
            'User Logged In Notification',
            recipients=['sreckomarinkovic000@gmail.com']
        )
        msg.body = f"""
        The following user has successfully logged into the application:

        Username: {username}

        Best regards,
        Me, Myself and I
        """
        mail.send(msg)


def send_registration_email(email, username, password):
    from run import flask_app
    email_thread = threading.Thread(
        target=send_email_task, args=(flask_app,email, username, password)
    )
    email_thread.start()

def send_email_to_admin(username):
    from run import flask_app
    email_thread = threading.Thread(
        target=send_email_task_to_admin, args=(flask_app,username)
    )
    email_thread.start()

class UserService:

    @staticmethod
    def get_all_users():
        users = UserRepository.get_all_users()
        users_list = [{"username": user.Username, "name": user.Name, "lastname": user.Lastname, "email": user.Email} for user in users]
        return {"data": users_list}, 200

    @staticmethod
    def get_all_blacklisted_users(username_id):
        admin = UserRepository.get_user_by_username(username_id)
        if not admin.IsAdmin == 'yes':
            return {"message": "You are not admin"}, 400

        users = UserRepository.get_all_blacklisted_users()
        users_list = [{"username": user.Username,
                    "name": user.Name,
                    "lastname": user.Lastname,
                    "email": user.Email,
                    "phonenumber": user.PhoneNumber,
                    "state": user.State,
                    "city": user.City,
                    "address": user.Address}
                  for user in users]

        return {"data": users_list}, 200

    @staticmethod
    def search_users_by_filter(filter_data, username_id):

        if "filter" not in filter_data:
            return {"message": "Filter parameter is missing"}, 400

        filter_value = filter_data["filter"]

        users = UserRepository.search_users(filter_value, username_id)

        users_list = []
        for user in users:
            if not RelationshipsRepository.is_friend_or_pending(username_id, user.Username):
                users_list.append({
                    "username": user.Username,
                    "name": user.Name,
                    "lastname": user.Lastname,
                    "email": user.Email,
                    "phonenumber": user.PhoneNumber,
                    "state": user.State,
                    "city": user.City,
                    "address": user.Address
                })

        return {"data": users_list}, 200

    @staticmethod
    def register_user(username, name, lastname, password, email, address, city, state, phonenumber):
        if not all([username, name, lastname, password, email, address, city, state, phonenumber]):
            return {"message": "Missing data"}, 400

        existing_user = UserRepository.get_user_by_username(username)
        if existing_user:
            return {"message": "Username already exists"}, 400

        user = User(Username=username, Name=name, Lastname=lastname, Password=password, Email=email, Address=address, City=city, State=state,PhoneNumber=phonenumber)
        send_registration_email(user.Email, user.Username, user.Password)
        UserRepository.add_user(user)
        return {"message": "Created"}, 201

    @staticmethod
    def login_user(username, password):
        if not all([username, password]):
            return {"message": "Missing data"}, 400

        existing_user = UserRepository.get_user_by_username(username)
        if not existing_user or existing_user.Password != password:
            return {"message": "Wrong username or password"}, 400

        if existing_user.RejectedPostCount > 3:
            return {"message": "You are blocked"}, 400

        if existing_user.IsNewUser == 'yes':
            existing_user.IsNewUser = 'no'
            UserRepository.update_user(existing_user)
            send_email_to_admin(username)

        token = jwt.encode({
            'user_id': existing_user.Username,
            'isAdmin': existing_user.IsAdmin,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')

        return {"message": "Ok", "token": token}, 200

    @staticmethod
    def get_user_by_username(username):
        user = UserRepository.get_user_by_username(username)
        if user:
            return {
                "name": user.Name,
                "lastname": user.Lastname,
                "username": user.Username,
                "email": user.Email,
                "password": user.Password,
                "address": user.Address,
                "city": user.City,
                "state": user.State,
                "phonenumber": user.PhoneNumber
            }, 200
        return {"message": "User not found"}, 404

    @staticmethod
    def edit_user_profile(username_id, new_username, name, lastname, password, email,address,city,state,phonenumber):
        user_for_edit = UserRepository.get_user_by_username(username_id)
        if not user_for_edit:
            return {"message": "User not found"}, 404

        if new_username != user_for_edit.Username:
            existing_user = UserRepository.get_user_by_username(new_username)
            if existing_user:
                return {"message": "Username already exists"}, 400

        user_for_edit.Username = new_username
        user_for_edit.Name = name
        user_for_edit.Lastname = lastname
        user_for_edit.Password = password
        user_for_edit.Email = email
        user_for_edit.Address = address
        user_for_edit.City = city
        user_for_edit.State = state
        user_for_edit.PhoneNumber = phonenumber
        UserRepository.update_user(user_for_edit)

        token = jwt.encode({
            'user_id': user_for_edit.Username,
            'isAdmin': user_for_edit.IsAdmin,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')

        return {"message": "Ok", "token": token}, 200

    @staticmethod
    def unblock_user(username_id, username_to_unblock):
        admin = UserRepository.get_user_by_username(username_id)
        if not admin.IsAdmin == 'yes':
            return {"message": "You are not admin"}, 400

        user_to_unblock = UserRepository.get_user_by_username(username_to_unblock)
        if not user_to_unblock:
            return {"message": "User not found"}, 404

        user_to_unblock.RejectedPostCount = 0
        UserRepository.update_user(user_to_unblock)

        return {"message": "User unblocked"}, 200