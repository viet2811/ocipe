from django.urls import path
from . import views

urlpatterns = [
    path("healthz/", views.health, name="check-health"),
    path("db/", views.db_ping, name="db_ping"),
]
