from flask import Blueprint, request, jsonify
from ..models.loan import Loan
from ..utils.auth import token_required
from .. import db

loan_bp = Blueprint('loan', __name__)

@loan_bp.route('/', methods=['GET'])
@token_required
def get_loans(current_user):
    loans = Loan.query.filter_by(user_id=current_user.id).all()
    return jsonify([l.to_dict() for l in loans]), 200

@loan_bp.route('/', methods=['POST'])
@token_required
def create_loan(current_user):
    data = request.get_json()
    if not data or not data.get('person_name') or not data.get('amount') or not data.get('type'):
        return jsonify({'message': 'Missing data'}), 400
        
    loan = Loan(
        user_id=current_user.id,
        person_name=data['person_name'],
        amount=float(data['amount']),
        type=data['type'],
        status=data.get('status', 'Unpaid')
    )
    
    db.session.add(loan)
    db.session.commit()
    
    return jsonify(loan.to_dict()), 201

@loan_bp.route('/<int:id>', methods=['PUT', 'DELETE'])
@token_required
def manage_loan(current_user, id):
    loan = Loan.query.filter_by(id=id, user_id=current_user.id).first()
    if not loan:
        return jsonify({'message': 'Loan not found'}), 404
        
    if request.method == 'DELETE':
        db.session.delete(loan)
        db.session.commit()
        return jsonify({'message': 'Loan deleted'})
        
    if request.method == 'PUT':
        data = request.get_json()
        if 'amount' in data: loan.amount = float(data['amount'])
        if 'status' in data: loan.status = data['status']
        if 'person_name' in data: loan.person_name = data['person_name']
        if 'type' in data: loan.type = data['type']
        db.session.commit()
        return jsonify(loan.to_dict())
