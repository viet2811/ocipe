from rest_framework import generics, permissions
from .serializers import FridgeSerializer
from .models import Fridge

class FridgeListCreate(generics.ListCreateAPIView):
    serializer_class = FridgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Fridge.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)