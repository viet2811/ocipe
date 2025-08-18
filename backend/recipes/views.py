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

from urllib.parse import urlparse
from rest_framework.exceptions import ValidationError


# POST, GET, DELETE
class RecipeListCreate(generics.ListCreateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_class = RecipeFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.OrderingFilter
    ]
    ordering_fields = ['added_date'] #Will have frequency..

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # DELETE
    def delete(self, request, *args, **kwargs):
        Recipe.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class RecipeBulkCreate(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Expecting a list of recipes
        recipeList = request.data.get('list')
        if not recipeList:
            return Response({"error": "Missing list in request body"}, status=status.HTTP_400_BAD_REQUEST)
        elif not isinstance(recipeList, list):
            return Response(
                {"detail": "Expected a list of recipes."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = RecipeSerializer(data=recipeList, many=True)
        if serializer.is_valid():
            serializer.save(user=request.user)  # pass user to each recipe
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# GET, UPDATE, DELETE
class SingleRecipeListRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RecipeSerializer
    lookup_field = "pk"

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user)

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


class RefreshRecipesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        updated = Recipe.objects.filter(user=request.user).update(state='active')
        return Response({"updated_count": updated}, status=status.HTTP_200_OK)