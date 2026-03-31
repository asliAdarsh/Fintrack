from flask import Blueprint, request, jsonify
from ..models.category import Category
from ..utils.auth import token_required
from .. import db

category_bp = Blueprint('category', __name__)

@category_bp.route('/', methods=['GET'])
@token_required
def get_categories(current_user):
    categories = Category.query.filter_by(user_id=current_user.id).all()
    return jsonify([c.to_dict() for c in categories]), 200

@category_bp.route('/', methods=['POST'])
@token_required
def create_category(current_user):
    data = request.get_json()
    if not data or not data.get('name') or not data.get('type'):
        return jsonify({'message': 'Missing data'}), 400
        
    category = Category(
        user_id=current_user.id,
        name=data['name'],
        type=data['type'],
        color_code=data.get('color_code', '#10b981' if data['type'] == 'Income' else '#ef4444'),
        icon=data.get('icon', 'Tags')
    )
    
    db.session.add(category)
    db.session.commit()
    
    return jsonify(category.to_dict()), 201

@category_bp.route('/<int:id>', methods=['PUT', 'DELETE'])
@token_required
def manage_category(current_user, id):
    category = Category.query.filter_by(id=id, user_id=current_user.id).first()
    if not category:
        return jsonify({'message': 'Category not found'}), 404
        
    if request.method == 'DELETE':
        db.session.delete(category)
        db.session.commit()
        return jsonify({'message': 'Category deleted'})
        
    if request.method == 'PUT':
        data = request.get_json()
        if 'name' in data: category.name = data['name']
        if 'type' in data: category.type = data['type']
        if 'color_code' in data: category.color_code = data['color_code']
        if 'icon' in data: category.icon = data['icon']
        db.session.commit()
        return jsonify(category.to_dict())
