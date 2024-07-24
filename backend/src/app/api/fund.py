import json
from flask import Blueprint, jsonify, request, current_app

fund_api = Blueprint('fund_api', __name__)

TTL_24h = 86400  # 24 hours

@fund_api.route('/fmarket/res/products/filter', methods=['POST'])
def filter_funds():
    redis_client = current_app.config['REDIS_CLIENT']
    payload = request.json
    funds_key = "funds:data"
    funds_data = redis_client.get(funds_key)
    
    if not funds_data:
        return jsonify({"message": "No funds data found"}), 404
    
    funds = json.loads(funds_data)
    
    # Filtering logic based on payload
    filtered_funds = [
        fund for fund in funds
        if (not payload['types'] or fund['type'] in payload['types']) and
           (not payload['issuerIds'] or fund['issuerId'] in payload['issuerIds']) and
           (not payload['fundAssetTypes'] or fund['assetType'] in payload['fundAssetTypes']) and
           (not payload['bondRemainPeriods'] or fund['bondRemainPeriod'] in payload['bondRemainPeriods']) and
           (payload['isIpo'] is None or fund['isIpo'] == payload['isIpo']) and
           (payload['isBuyByReward'] is None or fund['isBuyByReward'] == payload['isBuyByReward'])
    ]
    
    # Sorting logic based on payload
    sort_field = payload.get('sortField', 'annualizedReturn36Months')
    sort_order = payload.get('sortOrder', 'DESC')
    reverse_order = sort_order == 'DESC'
    filtered_funds.sort(key=lambda x: x.get(sort_field, 0), reverse=reverse_order)
    
    # Pagination logic based on payload
    page = payload.get('page', 1)
    page_size = payload.get('pageSize', 7)
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    paginated_funds = filtered_funds[start_index:end_index]
    
    return jsonify(paginated_funds)


@fund_api.route('/fmarket/res/product/get-nav-history', methods=['POST'])
def get_fund_nav():
    redis_client = current_app.config['REDIS_CLIENT']
    payload = request.json
    fund_id = payload['productId']
    nav_history_key = generate_redis_key(fund_id, "nav_history")
    nav_history_data = redis_client.get(nav_history_key)
    
    if not nav_history_data:
        return jsonify({"message": f"No NAV history found for fund ID {fund_id}"}), 404
    
    nav_history = json.loads(nav_history_data)
    
    # Filter NAV history based on dates if 'isAllData' is not set to 1
    if payload.get('isAllData') != 1:
        from_date = payload['fromDate']
        to_date = payload['toDate']
        nav_history = [
            nav for nav in nav_history
            if from_date <= nav['date'] <= to_date
        ]
    
    return jsonify(nav_history)

def generate_redis_key(fund_id, data_type):
    return f"fund:{fund_id}:{data_type}"
