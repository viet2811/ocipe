from rest_framework import generics, permissions
from .serializers import FridgeSerializer, FridgeIngredientSerializer
from .models import Fridge, FridgeIngredient

class FridgeList(generics.ListAPIView):
    serializer_class = FridgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Fridge.objects.filter(user=self.request.user)
    

# GET, UPDATE, DELETE
class FridgeIngredientUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = FridgeIngredientSerializer
    lookup_field = "id"

    def get_queryset(self):
        return FridgeIngredient.objects.filter(fridge__user=self.request.user)
    
# POST
class FridgeIngredientCreate(generics.CreateAPIView):
    serializer_class = FridgeIngredientSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return FridgeIngredient.objects.filter(fridge__user=self.request.user)