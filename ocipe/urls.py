from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/recipes/', include("recipes.urls")),
    path('api/user/', include("users.urls")),
    path('api/fridge/', include("fridge.urls"))
]
