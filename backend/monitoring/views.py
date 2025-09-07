from django.http import HttpResponse
from django.db import connection

def health(request):
    return HttpResponse({"status": "ok"})

def db_ping(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1;")
        result = cursor.fetchone()
    return HttpResponse({"db": result[0]})