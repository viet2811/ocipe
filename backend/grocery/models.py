from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    recipes = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)