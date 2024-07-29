import os

from typing import *
from vnstock3 import Vnstock


# Set the environment variable
if "ACCEPT_TC" not in os.environ:
    os.environ["ACCEPT_TC"] = "tôi đồng ý"

# In-memory cache
stock_data_cache = {}

def crawl(symbol: str):
    """Crawl stock data and save it to PostgreSQL."""
    if symbol in stock_data_cache:
        df = stock_data_cache[symbol]
    else:
        stock = Vnstock().stock(symbol=symbol, source='VCI')
        df = stock.quote.history(symbol=symbol, start='2019-01-01', end='2030-12-31')
        stock_data_cache[symbol] = df
    
    return df