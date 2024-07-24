# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Install PostgreSQL client and build dependencies
RUN apt-get update && \
    apt-get install -y build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the image
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the image
COPY ./src/ ./backend/src/

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=backend.src.app.api
ENV FLASK_ENV=production  

# Expose the port the app runs on
EXPOSE 9000

# Run the Gunicorn server
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:9000", "backend.src.app.api:create_app()"]