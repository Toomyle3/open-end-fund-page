from flask import Flask, request, jsonify
from flask_restplus import Api, Resource, fields
from concurrent.futures import ThreadPoolExecutor


# Initialize Flask app and API
app = Flask(__name__)
api = Api(app, version='1.0', title='Stock API', description='A simple Stock API')
ns = api.namespace('stocks', description='Stock operations')

# Define the stock model
stock_model = api.model('Stock', {
    'symbol': fields.String(required=True, description='Stock symbol'),
    'date': fields.String(required=True, description='Date'),
    'open': fields.Float(description='Opening price'),
    'high': fields.Float(description='Highest price'),
    'low': fields.Float(description='Lowest price'),
    'close': fields.Float(description='Closing price'),
    'volume': fields.Integer(description='Volume')
})