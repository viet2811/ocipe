from django.shortcuts import render

# Generics for simple CRUD operations
from rest_framework import status, generics, permissions, filters

from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Recipe
from .serializers import RecipeSerializer
from .filters import RecipeFilter
from django.db.models import Count, Q

# POST, GET, DELETE
class RecipeListCreate(generics.ListCreateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = RecipeFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    search_fields = ['name', 'meat_type']
    ordering_fields = ['name', 'meat_type', 'longevity', 'frequency'] #Will have frequency..

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # DELETE
    def delete(self, request, *args, **kwargs):
        Recipe.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# GET, UPDATE, DELETE
class RecipeListRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RecipeSerializer
    lookup_field = "pk"

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user)
