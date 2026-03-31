from flask import Blueprint, request, jsonify
from ..models.account import Account
from ..utils.auth import token_required
from .. import db

account_bp = Blueprint('account', __name__)

@account_bp.route('/', methods=['GET'])
@token_required
def get_accounts(current_user):
    accounts = Account.query.filter_by(user_id=current_user.id).all()
    return jsonify([a.to_dict() for a in accounts]), 200

@account_bp.route('/', methods=['POST'])
@token_required
def create_account(current_user):
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'message': 'Missing data'}), 400
        
    initial_balance = float(data.get('initial_balance', 0.0))
    account = Account(
        user_id=current_user.id,
        name=data['name'],
        type=data.get('type', 'Checking'),
        initial_balance=initial_balance,
        current_balance=initial_balance
    )
    
    db.session.add(account)
    db.session.commit()
    
    return jsonify(account.to_dict()), 201

@account_bp.route('/<int:id>', methods=['PUT', 'DELETE'])
@token_required
def manage_account(current_user, id):
    account = Account.query.filter_by(id=id, user_id=current_user.id).first()
    if not account:
        return jsonify({'message': 'Account not found'}), 404
        
    if request.method == 'DELETE':
        db.session.delete(account)
        db.session.commit()
        return jsonify({'message': 'Account deleted'})
        
    if request.method == 'PUT':
        data = request.get_json()
        if 'name' in data: account.name = data['name']
        if 'type' in data: account.type = data['type']
        
        if 'initial_balance' in data:
            new_initial = float(data['initial_balance'])
            diff = new_initial - account.initial_balance
            account.initial_balance = new_initial
            account.current_balance += diff
            
        db.session.commit()
        return jsonify(account.to_dict())
