import json
from flask import Blueprint, jsonify, request, current_app
import redis

fund_api = Blueprint('fund_api', __name__)
redis_client = current_app.config['REDIS_CLIENT']

TTL_24h = 86400  # 24 hours

@fund_api.route('/api/funds', methods=['GET'])
def get_funds():
    funds_key = "funds:data"
    funds_data = redis_client.get(funds_key)
    
    if funds_data:
        funds = json.loads(funds_data)
        return jsonify(funds)
    else:
        return jsonify({"message": "No funds data found"}), 404

@fund_api.route('/api/fund/<int:fund_id>/nav', methods=['GET'])
def get_fund_nav(fund_id):
    nav_history_key = generate_redis_key(fund_id, "nav_history")
    nav_history_data = redis_client.get(nav_history_key)
    
    if nav_history_data:
        nav_history = json.loads(nav_history_data)
        return jsonify(nav_history)
    else:
        return jsonify({"message": f"No NAV history found for fund ID {fund_id}"}), 404

def generate_redis_key(fund_id, data_type):
    return f"fund:{fund_id}:{data_type}"
