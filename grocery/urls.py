from django.urls import path
from . import views

urlpatterns = [
    # All recipes
    path('', views.GroceryList.as_view(), name="grocery-list-retrieval"),
]