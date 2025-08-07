from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipes = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class GroceryList(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class GroceryListItem(models.Model):
    grocery = models.ForeignKey(GroceryList, on_delete=models.CASCADE, related_name="items")
    item = models.CharField(max_length=50)
    isChecked = models.BooleanField(default=False)
