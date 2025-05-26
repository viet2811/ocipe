from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from .models import FridgeIngredient

class FridgeIngredientAuthTests(APITestCase):
    def setUp(self):
        self.username = 'testuser'
        self.password = 'testpass123'
        # Register user
        register_url = reverse('register')
        self.client.post(register_url, {'username': self.username, 'password': self.password})
        # Obtain JWT token
        url = reverse('token_obtain_pair')
        response = self.client.post(url, {'username': self.username, 'password': self.password})
        self.token = response.data['access']
        self.unauthenticated_user = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_add_ingredient_authenticated(self):
        # Set Authorization header
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
        url = reverse('create-fridge-ingredient')  # Make sure this matches your urls.py name
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
            {'name': 'Milk', 'group': 'dairy'},
            {'name': 'Egg', 'group': 'dairy'},
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
        sauce_group = response.data[0]['ingredient_list']['sauce']
        self.assertIsInstance(sauce_group, list)
        self.assertEqual('Fish Sauce', sauce_group[0]['name'])

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
        second_username = 'otheruser'
        second_password = 'otherpass123'
        register_url = reverse('register')
        self.unauthenticated_user.post(register_url, {'username': second_username, 'password': second_password})

        # Obtain JWT token for second user
        token_url = reverse('token_obtain_pair')
        token_response = self.unauthenticated_user.post(token_url, {'username': second_username, 'password': second_password})
        second_token = token_response.data['access']

        # Use second user's token to try to update the first user's ingredient
        self.unauthenticated_user.credentials(HTTP_AUTHORIZATION='Bearer ' + second_token)
        update_url = reverse('update-delete-fridge-ingredient', args=[ingredient_id])
        update_data = {'name': 'Chicken', 'group': 'notmeat'}
        response = self.unauthenticated_user.put(update_url, update_data)

        # Should be forbidden or not found
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
