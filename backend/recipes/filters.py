import django_filters
from .models import Recipe
from django.db.models import Count, Q

class RecipeFilter(django_filters.FilterSet):
    ingredients = django_filters.CharFilter(method='filter_by_ingredients')

    def filter_by_ingredients(self, queryset, name, value):
        # Prevent bug by leaving an empty space before comma
        ingredient_names = [name.strip().lower() for name in value.split(',') if name.strip()]
        # Return recipe rank on the most ingredient match with the request, excluding ones with no matched
        queryset = queryset.annotate(
            matched_count=Count(
                "ingredients",
                filter=Q(ingredients__name__in=ingredient_names),
                distinct=True
            ) * 100 / Count("ingredients")
        ).exclude( 
            matched_count=0   
        ).order_by('-matched_count')
        return queryset
    