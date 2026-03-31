from flask import Blueprint, jsonify
from sqlalchemy import func, extract
from ..models.transaction import Transaction
from ..models.category import Category
from ..utils.auth import token_required
from .. import db
import datetime

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/summary', methods=['GET'])
@token_required
def get_summary(current_user):
    income = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=current_user.id, type='Income').scalar() or 0.0
    expense = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=current_user.id, type='Expense').scalar() or 0.0
    
    now = datetime.datetime.utcnow()
    current_month = now.month
    current_year = now.year
    
    month_income = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == 'Income',
        extract('month', Transaction.date) == current_month,
        extract('year', Transaction.date) == current_year
    ).scalar() or 0.0
    
    month_expense = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == 'Expense',
        extract('month', Transaction.date) == current_month,
        extract('year', Transaction.date) == current_year
    ).scalar() or 0.0
    prev_month = 12 if current_month == 1 else current_month - 1
    prev_year = current_year - 1 if current_month == 1 else current_year

    prev_month_income = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == 'Income',
        extract('month', Transaction.date) == prev_month,
        extract('year', Transaction.date) == prev_year
    ).scalar() or 0.0
    
    prev_month_expense = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == 'Expense',
        extract('month', Transaction.date) == prev_month,
        extract('year', Transaction.date) == prev_year
    ).scalar() or 0.0
    
    return jsonify({
        "total_income": income,
        "total_expense": expense,
        "balance": income - expense,
        "month_income": month_income,
        "month_expense": month_expense,
        "month_balance": month_income - month_expense,
        "prev_month_income": prev_month_income,
        "prev_month_expense": prev_month_expense,
        "prev_month_balance": prev_month_income - prev_month_expense
    }), 200

@analytics_bp.route('/category-spending', methods=['GET'])
@token_required
def get_category_spending(current_user):
    results = db.session.query(
        Category.name,
        Category.color_code,
        func.sum(Transaction.amount).label('total')
    ).join(Transaction, Category.id == Transaction.category_id)\
    .filter(Transaction.user_id == current_user.id, Transaction.type == 'Expense')\
    .group_by(Category.name, Category.color_code).all()
    
    data = [{"name": r[0], "color": r[1], "value": r[2]} for r in results]
    return jsonify(data), 200

@analytics_bp.route('/cashflow', methods=['GET'])
@token_required
def get_cashflow(current_user):
    days_to_fetch = 7
    today = datetime.datetime.utcnow().date()
    start_date = today - datetime.timedelta(days=days_to_fetch - 1)
    
    transactions = db.session.query(
        func.date(Transaction.date).label('day'),
        Transaction.type,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == current_user.id,
        func.date(Transaction.date) >= start_date
    ).group_by(func.date(Transaction.date), Transaction.type).all()
    
    daily_data = {}
    for i in range(days_to_fetch):
        d = start_date + datetime.timedelta(days=i)
        daily_data[d.strftime('%a')] = {'name': d.strftime('%a'), 'income': 0, 'expense': 0}
        
    for row in transactions:
        day_str = row[0].strftime('%a')
        if day_str in daily_data:
            key = 'income' if row[1] == 'Income' else 'expense'
            daily_data[day_str][key] = float(row[2])
            
    return jsonify(list(daily_data.values())), 200
