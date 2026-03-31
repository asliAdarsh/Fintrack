import os
from werkzeug.utils import secure_filename
from flask import Blueprint, request, jsonify, current_app
from ..models.transaction import Transaction
from ..models.account import Account
from ..utils.auth import token_required
from .. import db
from datetime import datetime

transaction_bp = Blueprint('transaction', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@transaction_bp.route('/', methods=['GET'])
@token_required
def get_transactions(current_user):
    transactions = Transaction.query.filter_by(user_id=current_user.id).order_by(Transaction.date.desc()).all()
    return jsonify([t.to_dict() for t in transactions]), 200

@transaction_bp.route('/', methods=['POST'])
@token_required
def create_transaction(current_user):
    data = request.form if request.form else request.get_json()
    if not data:
        return jsonify({'message': 'Missing data'}), 400
        
    try:
        amount = float(data['amount'])
        t_type = data['type']
        account_id = int(data['account_id'])
        category_id = int(data['category_id'])
        title = data['title']
    except (KeyError, ValueError):
        return jsonify({'message': 'Invalid or missing fields'}), 400

    account = Account.query.filter_by(id=account_id, user_id=current_user.id).first()
    if not account:
        return jsonify({'message': 'Account not found'}), 404

    receipt_url = None
    if 'receipt' in request.files:
        file = request.files['receipt']
        if file and file.filename != '' and allowed_file(file.filename):
            filename = secure_filename(f"{current_user.id}_{datetime.now().timestamp()}_{file.filename}")
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            receipt_url = f"/uploads/{filename}"

    transaction = Transaction(
        user_id=current_user.id,
        account_id=account_id,
        category_id=category_id,
        amount=amount,
        type=t_type,
        title=title,
        receipt_url=receipt_url,
        date=datetime.fromisoformat(data['date']) if 'date' in data else datetime.utcnow()
    )

    db.session.add(transaction)

    if t_type == 'Expense':
        account.current_balance -= amount
    else:
        account.current_balance += amount

    db.session.commit()
    
    return jsonify(transaction.to_dict()), 201

@transaction_bp.route('/<int:id>', methods=['DELETE'])
@token_required
def delete_transaction(current_user, id):
    transaction = Transaction.query.filter_by(id=id, user_id=current_user.id).first()
    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404

    account = Account.query.filter_by(id=transaction.account_id, user_id=current_user.id).first()
    
    if account:
        if transaction.type == 'Expense':
            account.current_balance += transaction.amount
        else:
            account.current_balance -= transaction.amount

    db.session.delete(transaction)
    db.session.commit()

    return jsonify({'message': 'Transaction deleted'})
