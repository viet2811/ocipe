from django.urls import path
from . import views

urlpatterns = [
    # All recipes
    path('', views.GroceryList.as_view(), name="grocery-list-retrieval"),
    path('history/', views.HistoryList.as_view(), name="recipe-history-list")
]