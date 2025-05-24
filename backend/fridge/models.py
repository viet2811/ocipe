from django.db import models
from django.contrib.auth.models import User
from recipes.models import Ingredient

# Create your models here.
class Fridge(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ingredients = models.ManyToManyField("recipes.Ingredient", through="FridgeIngredient")

class FridgeIngredient(models.Model):
    fridge = models.ForeignKey(Fridge, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    group = models.CharField(max_length=30)