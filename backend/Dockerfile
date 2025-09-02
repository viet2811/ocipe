# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt gunicorn

COPY . .

EXPOSE 8000

# Run Django using Gunicorn, binding to Render's assigned $PORT
CMD ["gunicorn", "ocipe.wsgi:application", "--bind", "0.0.0.0:${PORT}"]

