from django.urls import path
from . import views

urlpatterns = [
    path('', views.FridgeListCreate.as_view(), name="fridge-list"),
]