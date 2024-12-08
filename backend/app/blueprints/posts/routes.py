from flask import Blueprint, request, jsonify
from app.blueprints.auth.auth import token_required
from app.services.post_service import PostService
from flask_cors import cross_origin
from flask import send_from_directory
from werkzeug.utils import secure_filename
import os
from flask import current_app
from flask import send_file
import uuid

posts_bp = Blueprint('posts_bp', __name__)

@posts_bp.route('/getallposts', methods=["GET"])
@cross_origin()
@token_required
def get_all_posts(user_data):
    response, status = PostService.get_all_posts()
    return jsonify(response), status


@posts_bp.route('/post-image/<post_id>', methods=['GET'])
@cross_origin()
def get_post_image(post_id):
    post, status = PostService.get_post_by_id(post_id)
    if status != 200:
        return jsonify({"message": "Post not found"}), 404

    image_uuid = post.get("image_path")
    if not image_uuid:
        return jsonify({"message": "Post has no image"}), 404

    folder = current_app.config['UPLOAD_FOLDER']
    possible_extensions = ['.png', '.jpg', '.jpeg', '.gif']

    for ext in possible_extensions:
        file_path = os.path.join(folder, f"{image_uuid}{ext}")
        if os.path.exists(file_path):
            return send_file(file_path)

    return jsonify({"message": "Image not found"}), 404

@posts_bp.route('/approvedpostsforuser', methods=['GET'])
@cross_origin()
@token_required
def get_all_approved_posts_for_user(user_data):
    current_user_id = user_data.get('user_id')
    current_user_username = PostService.get_username(current_user_id)
    response, status = PostService.get_all_approved_posts_for_user(current_user_username)
    return jsonify(response), status

@posts_bp.route('/createpost', methods=['POST'])
@cross_origin()
@token_required
def create(user_data):
    current_user_id = user_data.get('user_id')
    txt = request.form.get('txt')
    image = request.files.get('image')

    response, status = PostService.create_post_with_image(current_user_id, txt, image)
    return jsonify(response), status

@posts_bp.route('/editpost', methods=['GET', 'PUT'])
@cross_origin()
@token_required
def edit(user_data):
    if request.method == 'GET':
        post_id = request.args.get('post_id')
        response, status = PostService.get_post_by_id(post_id)
        return {"data": response}, status

    elif request.method == 'PUT':
        # Prvo uzimamo tekstualne podatke iz 'form' podataka
        post_id = request.form.get('post_id')
        txt = request.form.get('txt')

        # Obrada slike (ako je poslata)
        image_file = request.files.get('image')
        image_path = None
        folder = current_app.config['UPLOAD_FOLDER']
        image_filename = ''  # Na početku prazno
        image_name = ''
        if image_file:
            # Osiguravamo da slika ima sigurnu putanju
            image_filename = secure_filename(image_file.filename)
            image_ext = os.path.splitext(image_filename)[1]  # Uzmi ekstenziju
            # Generišemo UUID za novo ime slike
            image_name = uuid.uuid4().hex
            image_filename = f"{image_name}{image_ext}"
            image_path = os.path.join(folder, image_filename)  # Podesi putanju za čuvanje slika
            image_file.save(image_path)

        response, status = PostService.edit_post(post_id, txt, image_name)  # Prosleđujemo samo novo ime fajla
        return jsonify(response), status

@posts_bp.route('/delete', methods=['POST'])
@cross_origin()
@token_required
def delete_post(user_data):
    data = request.json  # Parse JSON body
    post_id = data.get('post_id')  # Extract post_id from the body

    if not post_id:
        return jsonify({'message': 'Post ID is required'}), 400

    post = PostService.get_post_by_id(post_id)
    if post:
        PostService.delete_post(post_id)
        response = {'message': 'Post deleted successfully'}
        return jsonify(response), 200

    return jsonify({'message': 'Post not found'}), 404

@posts_bp.route('/unapproved', methods=['GET'])
@cross_origin()
@token_required
def get_unapproved_posts(user_data):
    unapproved_posts = PostService.get_unapproved_posts()

    return jsonify(unapproved_posts), 200

@posts_bp.route('/friendsposts', methods=['GET'])
@cross_origin()
@token_required
def get_friends_posts_posts(user_data):
    current_user_id = user_data.get('user_id')
    response, status = PostService.get_all_friends_posts_for_user(current_user_id)
    return jsonify(response), status


@posts_bp.route('/approve', methods=['POST'])
@cross_origin()
@token_required
def approve_post(user_data):
    current_user_id = user_data.get('user_id')
    data = request.json  # Parse JSON body
    post_id = data.get('post_id')  # Extract post_id from the body
    post = PostService.get_post_by_id(post_id)
    if post:
        PostService.approve_post(post_id, current_user_id)
        response = {'message': 'Post approved'}
        return jsonify(response), 200
    return jsonify({'message': 'Post not found'}), 404

@posts_bp.route('/reject', methods=['POST'])
@cross_origin()
@token_required
def reject_post(user_data):
    current_user_id = user_data.get('user_id')
    data = request.json  # Parse JSON body
    post_id = data.get('post_id')  # Extract post_id from the body

    if not post_id:
        return jsonify({'message': 'Post ID is required'}), 400

    post = PostService.get_post_by_id(post_id)
    if post:
        PostService.reject_post(post_id,current_user_id)
        response = {'message': 'Post rejected'}
        return jsonify(response), 200

    return jsonify({'message': 'Post not found'}), 404