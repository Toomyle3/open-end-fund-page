from flask import Flask
import redis

def create_redis_client():
    return redis.Redis(host='redis', port=16379, db=0)

def create_app():
    app = Flask(__name__)

    # Initialize Redis client and store in app config
    app.config['REDIS_CLIENT'] = create_redis_client()

    from backend.src.app.api.fund import fund_api
    from backend.src.app.api.user import user_api
    # Import other blueprints as needed

    app.register_blueprint(fund_api)
    app.register_blueprint(user_api)
    # Register other blueprints

    return app
