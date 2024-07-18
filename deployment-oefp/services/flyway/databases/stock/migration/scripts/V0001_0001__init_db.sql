CREATE TABLE IF NOT EXISTS stock (
    date DATE PRIMARY KEY,
    open FLOAT,
    high FLOAT,
    low FLOAT,
    close FLOAT,
    volume INT
)

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    short_name VARCHAR,
    code VARCHAR,
    sub_code VARCHAR,
    trade_code VARCHAR,
    sip_code VARCHAR,
    price DECIMAL,
    nav DECIMAL,
    last_year_nav DECIMAL,
    buy_min INT,
    buy_max INT,
    buy_min_value DECIMAL,
    buy_max_value DECIMAL,
    sell_min INT,
    sell_min_value DECIMAL,
    transfer_sell_min INT,
    is_only_sell_min_not_sell_all BOOLEAN,
    holding_min INT,
    instock INT,
    holding_volume DECIMAL,
    issue_volume INT,
    issue_value DECIMAL,
    first_issue_at BIGINT,
    approve_at BIGINT,
    end_issue_at BIGINT,
    maturity_at BIGINT,
    website VARCHAR,
    website_url VARCHAR,
    custom_field VARCHAR,
    custom_value VARCHAR,
    expected_return DECIMAL,
    management_fee DECIMAL,
    performance_fee DECIMAL,
    closed_order_book_at TIME,
    closed_order_book_shift_day INT,
    closed_bank_note TIME,
    complete_transaction_duration INT,
    "description" TEXT,
    balance DECIMAL,
    fee_balance DECIMAL,
    vsd_fee_id VARCHAR,
    avg_annual_return DECIMAL,
    is_transferred BOOLEAN,
    "type" VARCHAR[30],
    "status" VARCHAR[30],
    risk_level VARCHAR[30],
    fund_type VARCHAR[30],
    data_fund_asset_type VARCHAR[30],
    raw_data JSONB,

    create_at BIGINT,
    update_at BIGINT,
);
