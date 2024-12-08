import jwt
import datetime
from app.repositories.relationships_repository import RelationshipsRepository
from app.repositories.user_repository import UserRepository
from app.blueprints.relationships.models import Relationships

SECRET_KEY = 'your_secret_key_here'

class RelationshipsService:
    @staticmethod
    def send_friend_request(requester_id, receiver_id):
        return RelationshipsRepository.add_friend(requester_id, receiver_id)

    @staticmethod
    def respond_to_friend_request(request_id, receiver_id, status):
        if status not in ['accepted', 'rejected']:
            raise ValueError("Invalid status")
        return RelationshipsRepository.update_friendship_status(request_id, receiver_id, status)

    @staticmethod
    def get_user_friends(user_id):
        friends = RelationshipsRepository.get_friends(user_id)

        all_user_ids = {
                           r.Requester_id for r in friends if r.Requester_id != user_id
                       } | {
                           r.Receiver_id for r in friends if r.Receiver_id != user_id
                       }

        users = UserRepository.get_users_by_usernames(list(all_user_ids))

        user_map = {user.Username: user for user in users}

        return [
            {
                'requestid': r.Id,
                'username': (
                    user_map[r.Requester_id].Username
                    if r.Requester_id in user_map
                    else user_map[r.Receiver_id].Username
                    if r.Receiver_id in user_map
                    else None
                ),
                'name': (
                    user_map[r.Requester_id].Name
                    if r.Requester_id in user_map
                    else user_map[r.Receiver_id].Name
                    if r.Receiver_id in user_map
                    else None
                ),
                'lastname': (
                    user_map[r.Requester_id].Lastname
                    if r.Requester_id in user_map
                    else user_map[r.Receiver_id].Lastname
                    if r.Receiver_id in user_map
                    else None
                ),
                'email': (
                    user_map[r.Requester_id].Email
                    if r.Requester_id in user_map
                    else user_map[r.Receiver_id].Email
                    if r.Receiver_id in user_map
                    else None
                ),
                'address': (
                    user_map[r.Requester_id].Address
                    if r.Requester_id in user_map
                    else user_map[r.Receiver_id].Address
                    if r.Receiver_id in user_map
                    else None
                ),
                'phonenumber': (
                    user_map[r.Requester_id].PhoneNumber
                    if r.Requester_id in user_map
                    else user_map[r.Receiver_id].PhoneNumber
                    if r.Receiver_id in user_map
                    else None
                ),
                'state': (
                    user_map[r.Requester_id].State
                    if r.Requester_id in user_map
                    else user_map[r.Receiver_id].State
                    if r.Receiver_id in user_map
                    else None
                ),
                'city': (
                    user_map[r.Requester_id].City
                    if r.Requester_id in user_map
                    else user_map[r.Receiver_id].City
                    if r.Receiver_id in user_map
                    else None
                ),
            }
            for r in friends
        ]

    @staticmethod
    def get_user_pending_requests(user_id):
        pending_requests = RelationshipsRepository.get_pending_requests(user_id)

        all_user_ids =  {r.Requester_id for r in pending_requests}

        users = UserRepository.get_users_by_usernames(list(all_user_ids))

        user_map = {user.Username: user for user in users}

        return [
            {
                'requestid': r.Id,
                'username': user_map[r.Requester_id].Username if r.Requester_id in user_map else None,
                'name': user_map[r.Requester_id].Name if r.Requester_id in user_map else None,
                'lastname': user_map[r.Requester_id].Lastname if r.Requester_id in user_map else None,
                'email': user_map[r.Requester_id].Email if r.Requester_id in user_map else None,
                'address': user_map[r.Requester_id].Address if r.Requester_id in user_map else None,
                'phonenumber': user_map[r.Requester_id].PhoneNumber if r.Requester_id in user_map else None,
                'state': user_map[r.Requester_id].State if r.Requester_id in user_map else None,
                'city' : user_map[r.Requester_id].City if r.Requester_id in user_map else None
            }
            for r in pending_requests
        ]

    @staticmethod
    def delete_relationship(request_id, username_id):
        return RelationshipsRepository.delete_relationship(request_id, username_id)
