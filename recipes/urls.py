from django.urls import path
from . import views

urlpatterns = [
    # All recipes
    path('', views.RecipeListCreate.as_view(), name="recipe-view-create"),
    # Specific recipes
    path('<int:pk>/', views.RecipeListRetrieveUpdateDestroy.as_view(), name="recipe-view-retrieve-update")
]