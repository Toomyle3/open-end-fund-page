import requests
import json

def get_fund_data():

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

    print(response.text)
