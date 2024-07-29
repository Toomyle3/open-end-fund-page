import requests
import json
import datetime
from typing import *

from backend.src.app.fmarket import fmodel

def get_fund_data() -> List[fmodel.Fund]:
    url = "https://api.fmarket.vn/res/products/filter"
    payload = json.dumps({
      "types": [
        "NEW_FUND",
        "TRADING_FUND"
      ],
      "issuerIds": [],
      "sortOrder": "DESC",
      "sortField": "annualizedReturn36Months",
      "page": 1,
      "pageSize": 100,
      "isIpo": False,
      "fundAssetTypes": [],
      "bondRemainPeriods": [],
      "searchField": "",
      "isBuyByReward": False,
      "thirdAppIds": []
    })
    headers = {
      'accept': 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9',
      'content-type': 'application/json',
      'origin': 'https://fmarket.vn',
      'priority': 'u=1, i',
      'referer': 'https://fmarket.vn/',
      'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    }

    response = requests.request("POST", url, headers=headers, data=payload)
    if response.status_code == 200:
        response_data = response.json()
        fund_data_rows = response_data.get("data", {}).get("rows", [])
        res = []
        for fund_data in fund_data_rows:
            fund = fmodel.Fund(fund_data)
            res.append(fund)
        return res
    else:
        print(f"Error: {response.status_code}")
        return []

def get_nav_history(productId: int) -> List[fmodel.NavHistory]:
    url = "https://api.fmarket.vn/res/product/get-nav-history"
    payload = json.dumps({
    "isAllData": 1,
    "productId": productId,
    "fromDate": None,
    "toDate": datetime.datetime.now().strftime("%Y%m%d")
    })
    headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'vi',
    'cache-control': 'no-cache',
    'content-type': 'application/json',
    'cookie': '_fbp=fb.1.1676461374165.1180226617; __iid=8457; __uidac=7770c31da673f22a424153acb59b4cab; _gcl_au=1.1.367815651.1714702950; __admUTMtime=1720272091; __su=0; __zi=3000.SSZzejyD7jCgcF2gob43s7oQfBI4NnkR88YkgvOT2Oqmoxhis1q8ntt2lEhG44N7Si7rxTKVHi5oplhi.1; _gid=GA1.2.1419859806.1721732922; _ga=GA1.2.844956223.1676461374; _ga_WSK33GNLTX=GS1.1.1721732921.128.1.1721734506.59.0.0',
    'origin': 'https://fmarket.vn',
    'pragma': 'no-cache',
    'priority': 'u=1, i',
    'referer': 'https://fmarket.vn/',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    if response.status_code == 200:
        response_data = response.json()
        nav_history_data = response_data.get("data", [])
        nav_history_list = [fmodel.NavHistory(nav) for nav in nav_history_data]
        return nav_history_list
    else:
        print(f"Error: {response.status_code}")
        return []
