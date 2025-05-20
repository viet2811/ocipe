from django.db import models
from django.contrib.auth.models import User

class Recipe(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    meat_type = models.CharField(max_length=15)
    longevity = models.IntegerField()
    frequency = models.CharField(max_length=20)
    note = models.TextField(blank=True)
    state = models.CharField(max_length=10)
    ingredients = models.ManyToManyField("Ingredient", through="RecipeIngredient")
    added_date = models.DateTimeField(auto_now_add=True)

class Ingredient(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length=50, blank=True)