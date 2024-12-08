import os
from flask import current_app
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
from app.repositories.posts_repository import PostsRepository
from app.repositories.user_repository import UserRepository
from app.blueprints.posts.models import Post
from flask_mail import Message
from app.app import mail
import threading

def send_email_to_admin_that_post_is_created_task(app, username):
    with app.app_context():  # Push the application context
        msg = Message(
            'New Post Created Notification',
            recipients=['aleksandarsasastefanjovana@gmail.com']
        )
        msg.body = f"""
        The following user has successfully created new post:

        Username: {username}

        Best regards,
        Your App Team
        """
        mail.send(msg)

def send_approved_email_task(app,email):
    with app.app_context():  # Push the application context
        msg = Message(
            'Welcome to Our App',
            recipients=[email]
        )
        msg.body = f"""
        Your post have been approved

        Best regards,
        Your App Team
        """
        mail.send(msg)

def send_reject_email_task(app,email):
    with app.app_context():  # Push the application context
        msg = Message(
            'Welcome to Our App',
            recipients=[email]
        )
        msg.body = f"""
        Your post have been rejected

        Best regards,
        Your App Team
        """
        mail.send(msg)

def send_block_email_task(app,email):
    with app.app_context():  # Push the application context
        msg = Message(
            'Account Blocked Notification',
            recipients=[email]
        )
        msg.body = f"""
         Dear user,

        You have been blocked because you exceeded the allowed number of rejected posts.

        Best regards,
        Your App Team
        """
        mail.send(msg)

def send_email_to_admin(username):
    from run import flask_app
    email_thread = threading.Thread(
        target=send_email_to_admin_that_post_is_created_task, args=(flask_app,username)
    )
    email_thread.start()

def send_approved_email(email):
    from run import flask_app
    email_thread = threading.Thread(
        target=send_approved_email_task, args=(flask_app,email)
    )
    email_thread.start()

def send_reject_email(email):
    from run import flask_app
    email_thread = threading.Thread(
        target=send_reject_email_task, args=(flask_app,email)
    )
    email_thread.start()

def send_block_email(email):
    from run import flask_app
    email_thread = threading.Thread(
        target=send_block_email_task, args=(flask_app,email)
    )
    email_thread.start()

class PostService:

    @staticmethod
    def get_all_posts():
        posts = PostsRepository.get_all_posts()
        posts_list = [
            {
                "post_id": post.ID,
                "username": post.Username,
                "txt": post.Txt,
                "image_path": post.ImagePath,
                "approved": post.Approved,
                "created_at": post.CreatedAt.isoformat()
            } for post in posts
        ]
        return {"data": posts_list}, 200

    @staticmethod
    def get_all_friends_posts_for_user(username):
        posts = PostsRepository.get_friends_posts(username)
        posts_list = [
            {
                "post_id": post.ID,
                "username": post.Username,
                "txt": post.Txt,
                "image_path": post.ImagePath,
                "approved": post.Approved,
                "created_at": post.CreatedAt.isoformat()
            } for post in posts
        ]
        return {"data": posts_list}, 200

    @staticmethod
    def get_all_approved_posts_for_user(username):
        posts = PostsRepository.get_all_approved_posts_for_user(username)
        posts_list = [
            {
                "post_id": post.ID,
                "username": post.Username,
                "txt": post.Txt,
                "image_path": post.ImagePath,
                "approved": post.Approved,
                "created_at": post.CreatedAt.isoformat()
            } for post in posts
        ]
        return {"data": posts_list}, 200

    @staticmethod
    def get_unapproved_posts():
        unapproved_posts_list = PostsRepository.get_unapproved_posts()
        posts_list = [
            {
                "post_id": post.ID,
                "username": post.Username,
                "txt": post.Txt,
                "image_path": post.ImagePath,
                "approved": post.Approved,
                "created_at": post.CreatedAt.isoformat()
            } for post in unapproved_posts_list
        ]
        return posts_list

    @staticmethod
    def create_post(post_id, username, txt, image_path):
        if not (txt or image_path):
            return {"message": "Missing data"}, 400

        post = Post(
            ID=post_id,
            Username=username,
            Txt=txt,
            ImagePath=image_path,
            CreatedAt=datetime.utcnow()
        )
        PostsRepository.add_post(post)
        return {"message": "Created"}, 201

    @staticmethod
    def create_post_with_image(user_id, txt, image):
        # Dohvatanje korisničkog imena
        user = UserRepository.get_user_by_username(user_id)
        if not user:
            return {"message": "User not found"}, 404

        username = user.Username

        # Obrada slike
        image_uuid = None
        if image and PostService.allowed_file(image.filename):
            image_uuid = PostService.save_image(image)

        # Generisanje ID-ja posta
        post_id = str(uuid.uuid4())

        # Kreiranje posta
        response, status = PostService.create_post(post_id, username, txt, image_uuid)

        if status == 201:
            # Emitovanje događaja za nove postove
            from app.app import socketio
            socketio.emit('new_post', {
                'post_id': post_id,
                'username': username,
                'txt': txt,
                'image_path': image_uuid
            })

        send_email_to_admin(username)

        return response, status

    @staticmethod
    def save_image(image):
        # Generisanje jedinstvenog imena slike
        extension = secure_filename(image.filename).rsplit('.', 1)[1].lower()
        image_uuid = str(uuid.uuid4())
        unique_filename = f"{image_uuid}.{extension}"

        # Putanja za čuvanje slike
        upload_folder = current_app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        image_path = os.path.join(upload_folder, unique_filename)
        image.save(image_path)  # Čuvanje slike na server

        return image_uuid

    @staticmethod
    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

    @staticmethod
    def edit_post(post_id, txt, image_filename):
        post = PostsRepository.get_post_by_id(post_id)
        if not post:
            return {"message": "Post not found"}, 404

        post.ID = post_id
        post.Txt = txt

        if image_filename:  # Ako je nova slika, koristimo ime slike sa UUID
            post.ImagePath = image_filename
        # Inače zadržavamo postojeći naziv slike, bez potrebe za dodatnim dodeljivanjem

        post.CreatedAt = datetime.utcnow()

        PostsRepository.update_post()

        return {"message": "Ok"}, 200

    @staticmethod
    def approve_post(post_id, user_id):
        post = PostsRepository.get_post_by_id(post_id)
        if not post:
            return {"message": "Post not found"}, 404
        post.Approved = "yes"

        user = UserRepository.get_user_by_username(post.Username)
        if not user:
            return {"message": "User not found"}, 404

        PostsRepository.update_post()

        #send_approved_email(user.Email)                                        !!!!!!!!Odkomentarisi kad oces mejl

        return {"message": "Post approved"}, 200

    @staticmethod
    def delete_post(post_id):
        post = PostsRepository.get_post_by_id(post_id)

        PostsRepository.delete_post(post)

        return {"message": "Ok"}, 200

    @staticmethod
    def get_post_by_id(post_id):
        post = PostsRepository.get_post_by_id(post_id)
        if post:
            return {
                "post_id": post.ID,
                "username": post.Username,
                "txt": post.Txt,
                "image_path": post.ImagePath,
                "approved" : post.Approved,
                "created_at": post.CreatedAt
            }, 200

        return {"message": "Post not found"}, 404

    @staticmethod
    def get_username(user_id):
        user = UserRepository.get_user_by_username(user_id)
        username = user.Username
        return username

    @staticmethod
    def reject_post(post_id, user_id):
        post = PostsRepository.get_post_by_id(post_id)
        if not post:
            return {"message": "Post not found"}, 404
        post.Approved = "rejected"

        user = UserRepository.get_user_by_username(post.Username)
        if not user:
            return {"message": "User not found"}, 404

        user.RejectedPostCount = user.RejectedPostCount+1

        UserRepository.update_user(user)
        PostsRepository.update_post()

        #if user.RejectedPostCount == 4:                                        !!!!!!
        #  send_block_email(user.Email)                                           !!!!
        #elif user.RejectedPostCount < 3:                                       !!!!!
        # send_reject_email(user.Email)                                        !!!!!!!!Odkomentarisi kad oces mejl

        return {"message": "Post rejected"}, 200