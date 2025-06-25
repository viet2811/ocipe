# backend/Dockerfile
FROM python:3.12-slim

# Set working directory inside container
WORKDIR /app

# COPY requirements
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy all the code
COPY . .

# Expose port to run on
EXPOSE 8000

# Start the server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
