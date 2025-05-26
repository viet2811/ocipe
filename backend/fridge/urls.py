from django.urls import path
from . import views

urlpatterns = [
    path('', views.FridgeList.as_view(), name="fridge-list"),
    path('ingredient/', views.FridgeIngredientCreate.as_view(), name='create-fridge-ingredient'),
    path('ingredient/<int:id>/', views.FridgeIngredientUpdateDestroy.as_view(), name='update-delete-fridge-ingredient')
]