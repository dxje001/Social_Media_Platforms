from app.blueprints.posts.models import Post
from app.blueprints.relationships.models import Relationships
from app.app import db



class PostsRepository:

    @staticmethod
    def get_all_posts():
        return Post.query.all()

    @staticmethod
    def get_all_approved_posts_for_user(username):
        return Post.query.filter_by(Username=username, Approved="yes").order_by(Post.CreatedAt.desc()).all()

    @staticmethod
    def get_post_by_id(post_id):
        return Post.query.filter_by(ID=post_id).first()

    @staticmethod
    def get_unapproved_posts():
        return Post.query.filter_by(Approved='no').all()

    @staticmethod
    def add_post(post):
        db.session.add(post)
        db.session.commit()

    @staticmethod
    def update_post():
        db.session.commit()

    @staticmethod
    def delete_post(post):
        db.session.delete(post)
        db.session.commit()

    @staticmethod
    def get_friends_posts(username):
        # Pronađi prijatelje korisnika
        friends_subquery = db.session.query(Relationships.Requester_id).filter(
            Relationships.Receiver_id == username, Relationships.Status == "accepted"
        ).union(
            db.session.query(Relationships.Receiver_id).filter(
                Relationships.Requester_id == username, Relationships.Status == "accepted"
            )
        ).subquery()

        # Dobij postove prijatelja
        posts = Post.query.filter(
            Post.Username.in_(friends_subquery),
            Post.Approved == "yes"
        ).order_by(Post.CreatedAt.desc()).all()

        return posts