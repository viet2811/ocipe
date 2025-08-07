from ocipe.tests import AuthenticatedAPITestCase
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from recipes.test_data import recipes
from recipes.models import Recipe

class GroceryTests(AuthenticatedAPITestCase):
    def setUp(self):
        self.token = self.register_and_authenticate()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.unauthenticated_user = APIClient()
        self.recipes = recipes
    
        # Post recipe
        recipe_url = reverse('recipe-view-create-destroy')
        self.ids = []
        for i in range(0,3):
            data = self.recipes[i]
            response = self.client.post(recipe_url, data, format='json')
            self.ids.append(response.data['id'])
        self.chosen_id = [self.ids[0], self.ids[-1]]

        # Input into fridge
        fridge_url = reverse('create-fridge-ingredient')
        ingredients = [
            {'name': 'chicken thighs', 'group': 'meat'},
            {'name': 'spring onions', 'group': 'condiment'},
            {'name': 'fish sauce', 'group': 'sauce'},
            {'name': 'sugar', 'group': 'condiment'},
            {'name': 'egg', 'group': 'dairy'},
        ]
        for data in ingredients:
            self.client.post(fridge_url, data)

    def test_get_grocery_list(self):
        url = reverse('grocery-ingredient-retrieve')
        data = {
            'recipe_ids': self.chosen_id
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        g_list = response.data['grocery_list']
        self.assertEqual(len(g_list), 5)
        self.assertIn('mirin', g_list)

        # Test recipe been used
        used = Recipe.objects.filter(user__username=self.username, state='used')
        self.assertEqual(len(used), 2)

    def test_get_grocery_history(self):
        url = reverse('grocery-ingredient-retrieve')
        datas = [
            {
                'recipe_ids': self.chosen_id
            },
            {
                'recipe_ids': [self.ids[1]]
            }
        ]
        for data in datas:
            self.client.post(url, data, format='json')
        
        history_url = reverse('recipe-history-list')
        response = self.client.get(history_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print(response.data)
        self.assertEqual(len(response.data), 2)
        most_recent = response.data[0]['recipes']
        self.assertIn(str(self.ids[1]), most_recent)
        self.assertIn('Chicken thighs', most_recent[f"{self.ids[1]}"])
