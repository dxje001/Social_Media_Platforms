from flask import Blueprint, request, jsonify
from app.blueprints.auth.auth import token_required
from app.services.relationships_service import RelationshipsService

relationships_bp = Blueprint('relationships_bp', __name__)

@relationships_bp.route('/addfriend', methods=["POST"])
@token_required
def add_friend_users(user_data):
    data = request.get_json()
    username_id = user_data.get('user_id')
    receiver_id = data.get('receiver_id')
    print(data)
    if not receiver_id:
        return jsonify({'message': 'Receiver ID is required'}), 400

    try:
        new_request = RelationshipsService.send_friend_request(username_id, receiver_id)
        return jsonify({'message': 'Friend request sent', 'request': str(new_request)}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@relationships_bp.route('/respondfriend', methods=["POST"])
@token_required
def respond_friend_request(user_data):
    data = request.get_json()
    request_id = data.get('request_id')
    status = data.get('status')
    username_id = user_data.get('user_id')

    if not request_id or not status:
        return jsonify({'message': 'Requester ID and status are required'}), 400

    try:
        updated_relationship = RelationshipsService.respond_to_friend_request(request_id, username_id, status)
        if updated_relationship:
            return jsonify({'message': f'Friend request {status}'}), 200
        return jsonify({'message': 'No such friend request found'}), 404
    except ValueError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@relationships_bp.route('/friends', methods=["GET"])
@token_required
def list_friends(user_data):
    try:
        username_id = user_data.get('user_id')
        friends = RelationshipsService.get_user_friends(username_id)
        return jsonify({'friends': friends}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@relationships_bp.route('/friendrequests', methods=["GET"])
@token_required
def list_friend_requests(user_data):
    try:
        username_id = user_data.get('user_id')
        pending_requests = RelationshipsService.get_user_pending_requests(username_id)
        return jsonify({'pending_requests': pending_requests}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@relationships_bp.route('/deleterelationship', methods=["DELETE"])
@token_required
def delete_relationship(user_data):
    data = request.get_json()
    request_id = data.get('request_id')
    username_id = user_data.get('user_id')

    if not request_id:
        return jsonify({'message': 'Request ID is required'}), 400

    try:
        deleted = RelationshipsService.delete_relationship(request_id, username_id)
        if deleted:
            return jsonify({'message': 'Relationship deleted successfully'}), 200
        else:
            return jsonify({'message': 'Relationship not found'}), 404
    except PermissionError as e:
        return jsonify({'message': str(e)}), 403 
    except Exception as e:
        return jsonify({'message': str(e)}), 500
