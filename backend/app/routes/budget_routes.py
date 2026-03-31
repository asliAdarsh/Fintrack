from flask import Blueprint, request, jsonify
from ..models.budget import Budget
from ..models.transaction import Transaction
from ..utils.auth import token_required
from .. import db
import datetime
from sqlalchemy import func

budget_bp = Blueprint('budget', __name__)

def get_period_start(period):
    now = datetime.datetime.utcnow()
    if period == 'Monthly':
        return datetime.datetime(now.year, now.month, 1)
    elif period == 'Quarterly':
        quarter = (now.month - 1) // 3
        return datetime.datetime(now.year, quarter * 3 + 1, 1)
    elif period == 'Half-Yearly':
        half = 0 if now.month <= 6 else 1
        return datetime.datetime(now.year, half * 6 + 1, 1)
    elif period == 'Yearly':
        return datetime.datetime(now.year, 1, 1)
    return now

@budget_bp.route('/', methods=['GET'])
@token_required
def get_budgets(current_user):
    budgets = Budget.query.filter_by(user_id=current_user.id).all()
    results = []
    
    for b in budgets:
        start_date = get_period_start(b.period)
        spent = db.session.query(func.sum(Transaction.amount)).filter(
            Transaction.user_id == current_user.id,
            Transaction.type == 'Expense',
            Transaction.date >= start_date
        ).scalar() or 0.0
        
        b_dict = b.to_dict()
        b_dict['spent'] = float(spent)
        results.append(b_dict)
        
    return jsonify(results), 200

@budget_bp.route('/', methods=['POST'])
@token_required
def create_budget(current_user):
    data = request.get_json()
    if not data or not data.get('amount') or not data.get('period'):
        return jsonify({'message': 'Missing data'}), 400
        
    budget = Budget(
        user_id=current_user.id,
        category_id=data.get('category_id'),
        amount=float(data['amount']),
        period=data['period']
    )
    
    db.session.add(budget)
    db.session.commit()
    
    return jsonify(budget.to_dict()), 201

@budget_bp.route('/<int:id>', methods=['PUT', 'DELETE'])
@token_required
def manage_budget(current_user, id):
    budget = Budget.query.filter_by(id=id, user_id=current_user.id).first()
    if not budget:
        return jsonify({'message': 'Budget not found'}), 404
        
    if request.method == 'DELETE':
        db.session.delete(budget)
        db.session.commit()
        return jsonify({'message': 'Budget deleted'})
        
    if request.method == 'PUT':
        data = request.get_json()
        if 'amount' in data: budget.amount = float(data['amount'])
        if 'period' in data: budget.period = data['period']
        if 'category_id' in data: budget.category_id = data['category_id']
        db.session.commit()
        return jsonify(budget.to_dict())
