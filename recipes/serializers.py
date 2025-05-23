from rest_framework import serializers
from .models import Recipe, Ingredient, RecipeIngredient

class IngredientInputSerializer(serializers.Serializer):
    name = serializers.CharField()
    quantity = serializers.CharField(required=False, allow_blank=True)

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientInputSerializer(many=True, write_only=True)
    ingredient_list = serializers.SerializerMethodField(read_only=True)
    # For when searching recipe by multiple ingredients
    accuracy = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Recipe
        fields = ['id', 'name', 'meat_type', 'longevity', 'frequency', 'note', 'state', 'ingredients','ingredient_list', 'added_date', 'accuracy']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if rep.get('accuracy') is None:
            rep.pop('accuracy')
        return rep

    def get_ingredient_list(self, obj):
        # Get all RecipeIngredient objects for this recipe
        recipe_ingredients = RecipeIngredient.objects.filter(recipe=obj)
        # Serialize as a list of dicts
        return [
            {
                "name": ri.ingredient.name,
                "quantity": ri.quantity
            }
            for ri in recipe_ingredients
        ]

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
    
    def get_accuracy(self, obj):
        matched_count = getattr(obj, 'matched_count', None)
        return matched_count #None