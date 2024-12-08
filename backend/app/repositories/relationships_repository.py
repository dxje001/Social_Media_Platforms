from app.blueprints.relationships.models import Relationships
from app.app import db

class RelationshipsRepository:
    @staticmethod
    def add_friend(requester_id, receiver_id):
        new_relationship = Relationships(
            Requester_id=requester_id,
            Receiver_id=receiver_id,
            Status='pending'
        )
        db.session.add(new_relationship)
        db.session.commit()
        return new_relationship

    @staticmethod
    def update_friendship_status(request_id, receiver_id, status):
        relationship = Relationships.query.filter_by(
            Id=request_id,
            Receiver_id=receiver_id
        ).first()
        if relationship:
            relationship.Status = status
            db.session.commit()
            return relationship
        return None

    @staticmethod
    def get_friends(user_id):
        return Relationships.query.filter(
            (Relationships.Requester_id == user_id) | (Relationships.Receiver_id == user_id),
            Relationships.Status == 'accepted'
        ).all()

    @staticmethod
    def get_pending_requests(user_id):
        return Relationships.query.filter(
            Relationships.Receiver_id == user_id,
            Relationships.Status == 'pending'
        ).all()

    def is_friend_or_pending(requester_id, receiver_id):
        relationship = Relationships.query.filter(
            ((Relationships.Requester_id == requester_id) & (Relationships.Receiver_id == receiver_id)) |
            ((Relationships.Requester_id == receiver_id) & (Relationships.Receiver_id == requester_id)),
            Relationships.Status.in_(['accepted', 'pending'])
        ).first()
        return relationship is not None

    @staticmethod
    def delete_relationship(request_id, username_id):
        relationship = Relationships.query.filter_by(Id=request_id).first()
        if relationship:
            if username_id == relationship.Requester_id or username_id == relationship.Receiver_id:
                db.session.delete(relationship)
                db.session.commit()
                return True
            else:
                raise PermissionError("You are not authorized to delete this relationship.")
        return False
