import os
import sys
import schedule
import time
from threading import Thread
from api import create_app

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))

from backend.src.app.dataservice import db
from backend.src.app.fmarket import fclient
from backend.src.app.cronjob import job

def scheduled_task():
    job.crawl_fmarket()

def main():
    # Schedule the task to run every hour
    job.crawl_fmarket()
    schedule.every().hour.do(scheduled_task)

    # Keep the script running
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    # Create an instance of the Flask app
    app = create_app()

    # Start the Flask app in a separate thread
    flask_thread = Thread(target=app.run, kwargs={'host': '0.0.0.0', 'port': 5000, 'debug': True, 'use_reloader': False})
    flask_thread.start()

    # Run the main scheduling function
    main()
