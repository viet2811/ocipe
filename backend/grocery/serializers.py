from rest_framework import serializers
from .models import History, GroceryList, GroceryListItem

class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = ['recipes', 'created_at']

class GroceryListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroceryListItem
        fields = ['id', 'item', 'isChecked']

class GroceryListSerializer(serializers.ModelSerializer):
    items = GroceryListItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = GroceryList
        fields = ['id', 'items']
