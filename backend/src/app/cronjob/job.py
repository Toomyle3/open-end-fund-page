import os
import sys
import json
import redis
import datetime
import schedule
import time

from typing import *
from vnstock3 import Vnstock

from backend.src.app.dataservice import db
from backend.src.app.fmarket import fclient

TTL_24h = 86400  # 24 hours

# Function to generate Redis key
def generate_redis_key(fund_id, data_type):
    return f"fund:{fund_id}:{data_type}"

def crawl_fmarket():
    # Define the Redis client
    redis_client = redis.Redis(host='redis', port=16379, db=0)

    funds = fclient.get_fund_data()
    
    # Save the funds data to Redis
    funds_key = "funds:data"
    funds_dicts = [fund.to_dict() for fund in funds]
    funds_value = json.dumps(funds_dicts, indent=4)
    redis_client.set(funds_key, funds_value)
    redis_client.expire(funds_key, TTL_24h)
    print(f"Saved funds data with key {funds_key}")

    for fund in funds:
        nav_history_list = fclient.get_nav_history(fund.id)
        
        # Generate Redis key
        nav_history_key = generate_redis_key(fund.id, "nav_history")
        
        # Convert list of NavHistory objects to list of dictionaries
        nav_history_dicts = [nav.to_dict() for nav in nav_history_list]
        
        # Save each response of each API request to Redis with a proper key
        redis_value = json.dumps(nav_history_dicts, indent=4)
        redis_client.set(nav_history_key, redis_value)
        redis_client.expire(nav_history_key, TTL_24h)
        
        print(f"Saved NAV history for fund {fund.shortName} with key {nav_history_key}")
