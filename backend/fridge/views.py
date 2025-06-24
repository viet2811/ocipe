from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import FridgeSerializer, FridgeIngredientSerializer, RenameIngredientGroupSerializer
from .models import Fridge, FridgeIngredient

class FridgeList(generics.RetrieveAPIView):
    serializer_class = FridgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return Fridge.objects.get(user=self.request.user)
    

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
    
# UPDATE group
class FridgeGroupUpdate(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, group_name):
        new_group = request.data.get("new_group")
        if not new_group:
            return Response({"error": "new_group is required"}, status=400)
        # Rename group
        FridgeIngredient.objects.filter(fridge__user=self.request.user, group=group_name).update(group=new_group)

        return Response(status=200)
    
    def delete(self, request, group_name):
        FridgeIngredient.objects.filter(
            fridge__user=self.request.user,
            group=group_name
        ).delete()

        return Response(status=200)