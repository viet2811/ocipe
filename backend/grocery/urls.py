from django.urls import path
from . import views

urlpatterns = [
    # All recipes
    path('', views.GroceryIngredientRetrieve.as_view(), name="grocery-ingredient-retrieve"),
    path('history/', views.HistoryList.as_view(), name="recipe-history-list"),
    path('history/recent/', views.MostRecentHistoryList.as_view(), name="recent-history-list"),
    path('list/', views.GroceryListRetrieveCreate.as_view(), name="grocery-list"),
    path('list/<int:id>/', views.GroceryListItemUpdateDestroy.as_view(), name="grocery-list-item-update-delete"),
]