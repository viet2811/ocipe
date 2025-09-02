from django.urls import path, include

urlpatterns = [
    path('api/recipes/', include("recipes.urls")),
    path('api/user/', include("users.urls")),
    path('api/fridge/', include("fridge.urls")),
    path('api/grocery/', include("grocery.urls")),
    path('api/monitoring/', include("monitoring.urls"))
]
