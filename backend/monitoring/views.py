from django.http import JsonResponse
from django.db import connection

def health(request):
    return JsonResponse({"status": "ok"})

def db_ping(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1;")
        result = cursor.fetchone()
    return JsonResponse({"db": result[0]})