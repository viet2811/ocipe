from rest_framework.views import APIView
from rest_framework import status, generics, permissions
from rest_framework.response import Response

from recipes.models import Recipe, RecipeIngredient, Ingredient
from fridge.models import Fridge, FridgeIngredient
from .models import History
from .serializers import HistorySerializer
from collections import Counter

class GroceryList(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        recipe_ids = request.data.get('recipe_ids', [])
        
        # Bad request
        if not isinstance(recipe_ids, list) or not recipe_ids:
            return Response({'error': 'recipe_ids must be a non-empty list.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = self.request.user
        userIngredient = Ingredient.objects.filter(user=user)
        fridge = Fridge.objects.get(user=user)  
        
        recipe_ids_counts = Counter(recipe_ids)

        # All ingredients needed for given recipeIds
        recipeIngredients = RecipeIngredient.objects.filter(
            recipe__id__in=recipe_ids,
            ingredient__user=user
        )

        ingredients_quantities = {}
        for ri in recipeIngredients:
            name = ri.ingredient.name
            quantity = ri.quantity
            repeat_count = recipe_ids_counts[ri.recipe_id]
            for _ in range(repeat_count):
                if name not in ingredients_quantities:
                    ingredients_quantities[name] = quantity
                elif quantity:
                    ingredients_quantities[name] += " + " + quantity

        # Fridge ingredients
        fridgeIngredients = FridgeIngredient.objects.filter(fridge=fridge)
        fridgeIngredientSet = set(fi.ingredient.name for fi in fridgeIngredients)

        # Grocery list
        # groceryList = recipeIngredientSet - fridgeIngredientSet
        groceryList = []
        others = []

        for name, agg_quantity in ingredients_quantities.items():
            item = {
                "name": name,
                "quantity": agg_quantity
            }
            if name not in fridgeIngredientSet:
                groceryList.append(item) 
            else:
                others.append(item)
            

        # Save recipes to history
        recipes = Recipe.objects.filter(id__in=recipe_ids).values_list('id', 'name', 'meat_type')
        recipes_data = {id:(name, mt) for id, name, mt in recipes}
        History.objects.create(user=user, recipes=recipes_data)

        # Update those recipe state to 'used'
        Recipe.objects.filter(id__in=recipe_ids).update(state='used')
        
        return Response(
            {
             'grocery_list': groceryList,
             'others': others
            }
        )

class HistoryList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class =  HistorySerializer

    def get_queryset(self):
        return History.objects.filter(user=self.request.user).order_by('-created_at')