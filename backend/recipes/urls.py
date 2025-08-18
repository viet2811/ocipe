from django.urls import path
from . import views

urlpatterns = [
    # All recipes
    path('', views.RecipeListCreate.as_view(), name="recipe-view-create-destroy"),
    # Specific recipes
    path('<int:pk>/', views.RecipeListRetrieveUpdateDestroy.as_view(), name="recipe-view-retrieve-update-destroy"),
    # Random any active recipe
    path('stats/', views.RecipeStatRetrieve.as_view(), name="get-recipe-nerd-stats"),
    path('genai/', views.GeminiURLAPIView.as_view(), name="generate-recipe-from-url"),
    path('refresh/', views.RefreshRecipesView.as_view(), name="refresh-all-recipes-state")
]