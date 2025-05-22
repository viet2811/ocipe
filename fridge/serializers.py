from rest_framework import serializers
from .models import Fridge, FridgeIngredient, Ingredient

class IngredientInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    group = serializers.CharField()

class FridgeSerializer(serializers.ModelSerializer):
    ingredients = IngredientInputSerializer(many=True, write_only=True)
    ingredient_list = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Fridge
        fields = ['ingredients', 'ingredient_list']
        read_only_fields = ['user']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])
        user = self.context['request'].user
        fridge, created = Fridge.objects.get_or_create(user=user)

        for ingredient_data in ingredients_data:
            name = ingredient_data['name']
            group = ingredient_data['group']
            ingredient, created = Ingredient.objects.get_or_create(
                name=name, user=user
            )
            FridgeIngredient.objects.create(
                fridge=fridge,
                ingredient=ingredient,
                group=group
            )

        return fridge
    
    def get_ingredient_list(self, obj):
        # Get all FridgeIngredient objects for this fridge
        fridge_ingredients = FridgeIngredient.objects.filter(fridge=obj)
        # Serialize as a list of dicts
        return [
            {
                "name": fi.ingredient.name,
                "group": fi.group
            }
            for fi in fridge_ingredients
        ]