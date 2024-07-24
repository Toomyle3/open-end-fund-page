import os
import sys
import schedule
import time
from threading import Thread
from api import create_app



from backend.src.app.dataservice import db
from backend.src.app.fmarket import fclient
from backend.src.app.cronjob import job

def scheduled_task():
    with app.app_context():
        job.crawl_fmarket()

def main():
    # Schedule the task to run every hour
    schedule.every().hour.do(scheduled_task)

    # Keep the script running
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    # Create an instance of the Flask app
    app = create_app()

    # Start the Flask app in a separate thread
    flask_thread = Thread(target=app.run, kwargs={
        'host': '0.0.0.0', 
        'port': 9000, 
        'debug': True, 
        'use_reloader': False,
    })
    flask_thread.start()

    # Run the main scheduling function
    main()
