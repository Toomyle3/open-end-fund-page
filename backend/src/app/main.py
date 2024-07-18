import os
from typing import Callable, List
from concurrent.futures import ThreadPoolExecutor
from vnstock3 import Vnstock
import backend.src.app.dataservice.db as db

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

    db.save_to_db(df, symbol)

def main(symbols: List[str]):
    with ThreadPoolExecutor() as executor:
        executor.map(crawl, symbols)

if __name__ == "__main__":
    symbols_to_crawl = ["FUESSV30", "VN30", "VN100"]
    main(symbols_to_crawl)
