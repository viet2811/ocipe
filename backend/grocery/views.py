from rest_framework.views import APIView
from rest_framework import status, generics, permissions
from rest_framework.response import Response

from recipes.models import Recipe, RecipeIngredient, Ingredient
from fridge.models import Fridge, FridgeIngredient
from .models import GroceryListItem, History, GroceryList
from .serializers import HistorySerializer, GroceryListSerializer, GroceryListItemSerializer
from collections import Counter

class GroceryIngredientRetrieve(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        recipe_ids = request.data.get('recipe_ids', [])
        
        # Bad request
        if not isinstance(recipe_ids, list) or not recipe_ids:
            return Response({'error': 'recipe_ids must be a non-empty list.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = self.request.user
        fridge = Fridge.objects.get(user=user)  
        

        # All ingredients needed for given recipeIds
        recipeIngredients = RecipeIngredient.objects.filter(
            recipe__id__in=recipe_ids,
            ingredient__user=user
        )

        # Count to allow repeated recipe has x times its ingredients
        recipe_ids_counts = Counter(recipe_ids)
        # Aggregated the quantity from multiple recipes    
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
        # recipes = Recipe.objects.filter(id__in=recipe_ids).values_list('id', 'name', 'meat_type')
        # recipes_data = [{
        #     "id": id,
        #     "name": name,
        #     "meat-type": mt
        # } for id, name, mt in recipes]
        History.objects.create(user=user, recipes=recipe_ids)

        # Update those recipe state to 'used'
        Recipe.objects.filter(id__in=recipe_ids).update(state='used')
        
        return Response(
            {
             'grocery_list': groceryList,
             'others': others
            }
        )

class MostRecentHistoryList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class =  HistorySerializer

    def get_queryset(self):
        return History.objects.filter(user=self.request.user).order_by('-created_at')[:1]
        
    
    # DELETE
    def delete(self, request, *args, **kwargs):
        History.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    



class GroceryListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GroceryListSerializer

    def get_queryset(self):
        return GroceryList.objects.filter(user=self.request.user)
    
class GroceryListRetrieveCreate(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        grocery_list, _ = GroceryList.objects.get_or_create(user=self.request.user)
        items = grocery_list.items.all()
        serializer = GroceryListItemSerializer(items, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        items_string = request.data.get('items', "")
        
        # Bad request
        if not items_string.strip():
            return Response({'error': 'No items provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        item_names = [line.strip() for line in items_string.strip().split('\n') if line.strip()]

        grocery_list, _ = GroceryList.objects.get_or_create(user=self.request.user)

        # Create new items
        GroceryListItem.objects.bulk_create([
            GroceryListItem(grocery=grocery_list, item=name)
            for name in item_names
        ])

        return Response(status.HTTP_201_CREATED)
    
    def delete(self, request):
        GroceryList.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)