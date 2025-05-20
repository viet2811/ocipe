import django_filters
from .models import Recipe
from django.db.models import Count, Q

class RecipeFilter(django_filters.FilterSet):
    ingredients = django_filters.CharFilter(method='filter_by_ingredients')

    def filter_by_ingredients(self, queryset, name, value):
        ingredient_names = value.split(',')
        queryset = (queryset
                    .filter(ingredients__name__in=ingredient_names)
                    .annotate(
                        matched_count=Count(
                            "ingredients",
                            filter=Q(ingredients__name__in=ingredient_names),
                            distinct=True
                        )   
                    )
                    .order_by("-matched_count")
        )
        return queryset
    
    class Meta:
        model = Recipe
        fields = {
            'name': ['iexact','icontains'],
            'meat_type': ['iexact', 'icontains'],
            'longevity': ['exact', 'lt', 'gt', 'range'],
            'frequency': ['iexact']
        }