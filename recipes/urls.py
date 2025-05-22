from django.urls import path
from . import views

urlpatterns = [
    # All recipes
    path('', views.RecipeListCreate.as_view(), name="recipe-view-create"),
    # Specific recipes
    path('<int:pk>/', views.RecipeListRetrieveUpdateDestroy.as_view(), name="recipe-view-retrieve-update"),
    # Random any active recipe
    path('random/', views.RandomAnyRecipeRetrieve.as_view(), name="retrieve-random-active-recipe"),
    path('stats/', views.RecipeStatRetrieve.as_view(), name="get-recipe-nerd-stats")
]