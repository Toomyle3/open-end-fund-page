import pytest
import json
from flask import Flask

from backend.src.app.api import create_app

@pytest.fixture
def app():
    app = create_app()
    app.config['TESTING'] = True
    app.config['REDIS_CLIENT'] = MockRedisClient()
    return app

@pytest.fixture
def client(app):
    return app.test_client()

class MockRedisClient:
    def __init__(self):
        self.data = {
            "funds:data": json.dumps([
                {"id": 1, "type": "NEW_FUND", "issuerId": 1, "assetType": "EQUITY", "bondRemainPeriod": "SHORT", "isIpo": False, "isBuyByReward": False, "annualizedReturn36Months": 5.0},
                {"id": 2, "type": "TRADING_FUND", "issuerId": 2, "assetType": "BOND", "bondRemainPeriod": "LONG", "isIpo": False, "isBuyByReward": False, "annualizedReturn36Months": 3.0},
                # Add more mock data as needed
            ]),
            "fund:23:nav_history": json.dumps([
                {"date": "20230725", "nav": 100.0},
                {"date": "20230726", "nav": 101.0},
                # Add more mock data as needed
            ])
        }

    def get(self, key):
        return self.data.get(key)

def test_filter_funds(client):
    payload = {
        "types": ["NEW_FUND", "TRADING_FUND"],
        "issuerIds": [],
        "sortOrder": "DESC",
        "sortField": "annualizedReturn36Months",
        "page": 1,
        "pageSize": 7,
        "isIpo": False,
        "fundAssetTypes": [],
        "bondRemainPeriods": [],
        "searchField": "",
        "isBuyByReward": False
    }
    response = client.post('/fmarket/res/products/filter', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) > 0
    assert data[0]["annualizedReturn36Months"] >= data[-1]["annualizedReturn36Months"]

def test_get_fund_nav(client):
    payload = {
        "isAllData": 0,
        "productId": 23,
        "fromDate": "20230725",
        "toDate": "20240727"
    }
    response = client.post('/fmarket/res/product/get-nav-history', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) > 0
    assert all("date" in nav and "nav" in nav for nav in data)
