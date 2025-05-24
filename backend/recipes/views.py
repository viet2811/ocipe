# Generics for simple CRUD operations
from rest_framework import status, generics, permissions, filters

from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from .models import Recipe
from .serializers import RecipeSerializer
from .filters import RecipeFilter
from django.db.models import Count, Q
from .gemini import getRecipeFromURL

import random
import json


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

# Random any recipe
class RandomAnyRecipeRetrieve(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RecipeSerializer

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user)
    
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(state='active')
        recipes = list(queryset)
        
        if not recipes:
            return Response({'detail': 'No active recipes found.'}, status=404)
        
        random_recipe = random.choice(list(queryset))
        serializer = self.get_serializer(random_recipe)
        return Response(serializer.data)


# Get stats
class RecipeStatRetrieve(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RecipeSerializer

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user)
    
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        meat_stats = (
            queryset
            .values('meat_type')
            .annotate(
                total=Count('id'),
                active=Count('id', filter=Q(state='active'))
            )
        )

        frequency_stats = (
            queryset
            .values('frequency')
            .annotate(
                total=Count('id'),
                active=Count('id', filter=Q(state='active'))
            )
        )

        return Response({
            "meat_type_stats": list(meat_stats),
            "frequency_stats": list(frequency_stats),
        })


class GeminiURLAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        url = request.data.get('url')
        if not url:
            return Response({"error": "Missing url in request body"}, status=status.HTTP_400_BAD_REQUEST)

        response = getRecipeFromURL(url)
        json_data = json.loads(response.candidates[0].content.parts[0].text)
        return Response(json_data)