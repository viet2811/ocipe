from rest_framework import serializers
from .models import Fridge, FridgeIngredient, Ingredient
from collections import OrderedDict

class FridgeSerializer(serializers.ModelSerializer):
    ingredient_list = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Fridge
        fields = ['ingredient_list']
        read_only_fields = ['user']

    def get_ingredient_list(self, obj):
        # Get all FridgeIngredient objects for this fridge
        fridge_ingredients = FridgeIngredient.objects.filter(fridge=obj).order_by('-group', 'id')
        # Serialize as a list of dicts by group
        grouped = OrderedDict()
        for fi in fridge_ingredients:
            group = fi.group
            if group not in grouped:
                grouped[group] = []
            grouped[group].append(
                {
                    "id": fi.id,
                    "name": fi.ingredient.name,
                }
            )
        return grouped
    
class FridgeIngredientSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    group = serializers.CharField()
    
    class Meta:
        model = FridgeIngredient
        fields = ['id', 'name', 'group']

    def create(self, validated_data):
        user = self.context['request'].user
        name = validated_data['name']
        group = validated_data['group']

        # user fridge
        fridge = Fridge.objects.get(user=user)
        # Ingredient
        ingredient, _ = Ingredient.objects.get_or_create(name=name, user=user)

        return FridgeIngredient.objects.create(
            fridge=fridge, ingredient=ingredient, group=group
        )
    
    def update(self, instance, validated_data):
        user = self.context['request'].user
        name = validated_data.get('name', instance.ingredient.name)
        group = validated_data.get('group', instance.group)
        # Get or create the ingredient
        ingredient, _ = Ingredient.objects.get_or_create(name=name, user=user)
        instance.ingredient = ingredient
        instance.group = group
        instance.save()
        return instance