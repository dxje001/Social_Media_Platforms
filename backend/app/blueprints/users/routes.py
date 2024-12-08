from flask import Blueprint, request, jsonify
from app.blueprints.auth.auth import token_required
from app.services.user_service import UserService

users_bp = Blueprint('users_bp', __name__)

@users_bp.route('/users', methods=["GET"])
def get_all_users():
    response, status = UserService.get_all_users()
    return jsonify(response), status

@users_bp.route('/blacklisted', methods=["GET"])
@token_required
def get_all_users_blacklisted_users(user_data):
    username_id = user_data.get('user_id')
    response, status = UserService.get_all_blacklisted_users(username_id)
    return jsonify(response), status

@users_bp.route('/searchfriend', methods=['POST'])
@token_required
def search_friend(user_data):
    data = request.json
    username_id = user_data.get('user_id')

    response, status = UserService.search_users_by_filter(data, username_id)
    return jsonify(response), status

@users_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    response, status = UserService.login_user(data.get('username'), data.get('password'))
    return jsonify(response), status

@users_bp.route('/register', methods=['POST'])
@token_required
def register(user_data):
    is_admin = user_data.get('isAdmin')
    if not(is_admin == 'yes'):
        return jsonify({"message": "Unauthorized"}),401

    data = request.json
    response, status = UserService.register_user(data.get('username'), data.get('name'), data.get('lastname'), data.get('password'), data.get('email'),data.get('address'),data.get('city'),data.get('state'),data.get('phonenumber'))
    return jsonify(response), status

@users_bp.route('/edituserprofile', methods=['GET', 'POST'])
@token_required
def edit_user_profile(user_data):
    username_id = user_data.get('user_id')
    if request.method == 'GET':
        response, status = UserService.get_user_by_username(username_id)
        return {"data": response}, status

    elif request.method == 'POST':
        data = request.json
        response, status = UserService.edit_user_profile(username_id, data.get('username'), data.get('name'), data.get('lastname'), data.get('password'), data.get('email'),data.get('address'),data.get('city'),data.get('state'),data.get('phonenumber'))
        return jsonify(response), status

@users_bp.route('/unblock', methods=['POST'])
@token_required
def unblock_user(user_data):
    username_id = user_data.get('user_id')
    data = request.json
    response, status = UserService.unblock_user(username_id, data.get('username'))
    return jsonify(response), status