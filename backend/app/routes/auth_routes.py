from flask import Blueprint, request, jsonify
from ..models.user import User
from ..models.category import Category
from ..models.account import Account
from ..utils.auth import generate_token, token_required
from .. import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({'message': 'Missing data'}), 400
        
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 400
        
    user = User(name=data['name'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    default_categories = [
        {'name': 'Food & Dining', 'type': 'Expense', 'color_code': '#ef4444', 'icon': 'Utensils'},
        {'name': 'Shopping', 'type': 'Expense', 'color_code': '#f97316', 'icon': 'ShoppingBag'},
        {'name': 'Housing', 'type': 'Expense', 'color_code': '#8b5cf6', 'icon': 'Home'},
        {'name': 'Transportation', 'type': 'Expense', 'color_code': '#3b82f6', 'icon': 'Car'},
        {'name': 'Salary', 'type': 'Income', 'color_code': '#10b981', 'icon': 'Banknote'},
        {'name': 'Investments', 'type': 'Income', 'color_code': '#06b6d4', 'icon': 'TrendingUp'}
    ]
    
    for cat in default_categories:
        new_cat = Category(user_id=user.id, name=cat['name'], type=cat['type'], color_code=cat['color_code'], icon=cat['icon'])
        db.session.add(new_cat)
        
    default_account = Account(user_id=user.id, name='Cash', initial_balance=0.0, current_balance=0.0)
    db.session.add(default_account)
    
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Could not verify', 'WWW-Authenticate': 'Basic auth="Login required"'}), 401
        
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'message': 'Could not verify', 'WWW-Authenticate': 'Basic auth="Login required"'}), 401
        
    token = generate_token(user.id)
    return jsonify({'token': token, 'user': user.to_dict()}), 200

@auth_bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify(current_user.to_dict()), 200
    
@auth_bp.route('/profile', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    if 'name' in data:
        current_user.name = data['name']
    if 'theme_preference' in data:
        current_user.theme_preference = data['theme_preference']
    
    db.session.commit()
    return jsonify(current_user.to_dict()), 200
