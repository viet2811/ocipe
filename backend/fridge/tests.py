from ocipe.tests import AuthenticatedAPITestCase
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from .models import FridgeIngredient

class FridgeTests(AuthenticatedAPITestCase):
    def setUp(self):
        self.token = self.register_and_authenticate()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.unauthenticated_user = APIClient()

    def test_add_ingredient_authenticated(self):
        url = reverse('create-fridge-ingredient')
        data = {
            'name': 'Chicken',
            'group': 'meat'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertTrue(
            FridgeIngredient.objects.filter(
                fridge__user__username=self.username,
                ingredient__name='Chicken',
                group='meat'
            ).exists()
        )

    def test_add_ingredient_unauthenticated(self):
        url = reverse('create-fridge-ingredient')
        data = {
            'name': 'Chicken',
            'group': 'meat'
        }
        response = self.unauthenticated_user.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(
            FridgeIngredient.objects.filter(
                fridge__user__username=self.username,
                ingredient__name='Chicken',
                group='meat'
            ).exists()
        )

    def test_view_all_ingredients(self):
        url = reverse('create-fridge-ingredient')

        ingredients = [
            {'name': 'Chicken thighs', 'group': 'meat'},
            {'name': 'Beef', 'group': 'meat'},
            {'name': 'Fish Sauce', 'group': 'sauce'},
            {'name': 'Sugar', 'group': 'condiment'},
        ]

        for data in ingredients:
            self.client.post(url, data)

        list_url = reverse('fridge-list')
        response = self.client.get(list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Structure
        self.assertIn('ingredient_list', response.data[0])
        ingre_list = response.data[0]['ingredient_list']
        
        ## 3 ingredient group
        self.assertEqual(3, len(ingre_list)) 

        ## Ingredient group values is a list
        sauce_group = ingre_list['sauce']
        self.assertIsInstance(sauce_group, list)
        self.assertEqual('Fish Sauce', sauce_group[0]['name'])
        
        ## 2 ingredient in meat_group
        meat_group = ingre_list['meat']
        self.assertEqual(2, len(meat_group))


    def test_update_a_ingredient_by_id(self):
        url = reverse('create-fridge-ingredient')

        ingredients = [
            {'name': 'Chicken thighs', 'group': 'meat'},
            {'name': 'Beef', 'group': 'meat'},
            {'name': 'Fish sauce', 'group': 'sauce'}
        ]

        ids = []
        for data in ingredients:
            response = self.client.post(url, data)
            ids.append(response.data['id'])

        update_id = ids[2]
        update_data = {'name': 'Fish sauce', 'group': 'Vietnamese'}
        update_url = reverse('update-delete-fridge-ingredient', args=[update_id])
        
        response = self.client.put(update_url, update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertTrue(
            FridgeIngredient.objects.filter(
                id=update_id,
                ingredient__name='Fish sauce',
                group='Vietnamese'
            ).exists()
        )
        self.assertFalse(
            FridgeIngredient.objects.filter(
                id=ids[1],
                ingredient__name='Fish sauce',
                group='Vietnamese'
            ).exists()
        )

    def test_update_a_ingredient_by_id_from_invalid_user(self):
        # First user creates an ingredient
        url = reverse('create-fridge-ingredient')
        response = self.client.post(url, {'name': 'Chicken', 'group': 'meat'})
        ingredient_id = response.data['id']

        # Register a second user
        second_token = self.register_and_authenticate(test_user_number=2)

        # Use second user's token to try to update the first user's ingredient
        self.unauthenticated_user.credentials(HTTP_AUTHORIZATION='Bearer ' + second_token)
        update_url = reverse('update-delete-fridge-ingredient', args=[ingredient_id])
        update_data = {'name': 'Chicken', 'group': 'notmeat'}
        response = self.unauthenticated_user.put(update_url, update_data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_a_ingredient_by_id(self):
        url = reverse('create-fridge-ingredient')

        ingredients = [
            {'name': 'Chicken thighs', 'group': 'meat'},
            {'name': 'Beef', 'group': 'meat'},
            {'name': 'Fish sauce', 'group': 'sauce'}
        ]

        ids = []
        for data in ingredients:
            response = self.client.post(url, data)
            ids.append(response.data['id'])
        
        delete_id = ids[1]
        delete_url = reverse('update-delete-fridge-ingredient', args=[delete_id])
        
        response = self.client.delete(delete_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            FridgeIngredient.objects.filter(id=delete_id).exists()
        )
        self.assertTrue(
            FridgeIngredient.objects.filter(id=ids[2]).exists()
        )
