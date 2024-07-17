CREATE TABLE IF NOT EXISTS stock (
    date DATE PRIMARY KEY,
    open FLOAT,
    high FLOAT,
    low FLOAT,
    close FLOAT,
    volume INT
)