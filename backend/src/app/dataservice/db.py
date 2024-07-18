import os
import pandas as pd
from typing import Callable, List
from concurrent.futures import ThreadPoolExecutor
import psycopg2
from vnstock3 import Vnstock


# Database connection details
DB_HOST = 'your_db_host'
DB_PORT = 'your_db_port'
DB_NAME = 'your_db_name'
DB_USER = 'your_db_user'
DB_PASS = 'your_db_password'

def connect_to_db():
    """Establish a connection to the PostgreSQL database."""
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )

def save_to_db(df: pd.DataFrame, table_name: str):
    """Save the DataFrame to PostgreSQL."""
    conn = connect_to_db()
    cur = conn.cursor()

    # Insert data into table
    for _, row in df.iterrows():
        insert_query = f"""
        INSERT INTO {table_name} (date, open, high, low, close, volume)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (date) DO NOTHING
        """
        cur.execute(insert_query, tuple(row))

    conn.commit()
    cur.close()
    conn.close()
