from rest_framework import serializers
from .models import Recipe, Ingredient, RecipeIngredient

class IngredientInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    quantity = serializers.CharField(required=False, allow_blank=True)

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientInputSerializer(many=True, write_only=True)

    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = ['user']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients', [])
        user = validated_data.pop('user')
        recipe = Recipe.objects.create(user=user, **validated_data)

        for ingredient_data in ingredients_data:
            name = ingredient_data['name']
            quantity = ingredient_data['quantity']
            ingredient, created = Ingredient.objects.get_or_create(
                name=name, user=user
            )
            RecipeIngredient.objects.create(
                recipe=recipe, ingredient=ingredient, quantity=quantity
            )

        return recipe
    
    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', None)
        # Update the Recipe fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if ingredients_data is not None:
            # Remove old ingredients
            instance.recipeingredient_set.all().delete()
            user = instance.user
            for ingredient_data in ingredients_data:
                name = ingredient_data['name']
                quantity = ingredient_data['quantity']
                # Add new or reference created one
                ingredient, created = Ingredient.objects.get_or_create(
                    name=name, user=user
                )
                RecipeIngredient.objects.create(
                    recipe=instance, ingredient=ingredient, quantity=quantity
                )
        return instance