from ocipe.tests import AuthenticatedAPITestCase
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from .test_data import recipes
from .models import Recipe

class RecipeTests(AuthenticatedAPITestCase):
    def setUp(self):
        self.token = self.register_and_authenticate()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.unauthenticated_user = APIClient()
        self.recipes = recipes

    def postRecipes(self, start, end):
        """Helper function to post multiple recipes into client database"""
        url = reverse('recipe-view-create-destroy')
        for i in range(start, end):
            data = self.recipes[i]
            response = self.client.post(url, data, format='json')
        return response

    def test_add_a_recipe(self):
        response = self.postRecipes(0,1)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id',response.data)
        # This field only apply to searching recipe with ingredient
        self.assertNotIn('accuracy', response.data)

    def test_get_all_recipe(self):
        self.postRecipes(0,1)
        url = reverse('recipe-view-create-destroy')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            Recipe.objects.filter(
                user__username=self.username,
            ).exists()
        )
    def test_delete_all_recipe(self):
        self.postRecipes(0,2)
        url = reverse('recipe-view-create-destroy')
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            Recipe.objects.filter(
                user__username=self.username,
            ).exists()
        )

    def test_get_a_recipe_by_id(self):
        post_response = self.postRecipes(0,2)
        # Last recipe post id
        id = post_response.data['id']
        url = reverse('recipe-view-retrieve-update-destroy', args=[id])
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(id, response.data['id'])
        self.assertEqual("Soy Chicken", response.data['name'])

    def test_get_a_recipe_by_id_from_another_user(self):
        post_response = self.postRecipes(0,2)
        # Last recipe post id
        id = post_response.data['id']
        url = reverse('recipe-view-retrieve-update-destroy', args=[id])

        # Register a second user
        second_token = self.register_and_authenticate(test_user_number=2)

        # Use second user's token to try to get the first user's recipe
        self.unauthenticated_user.credentials(HTTP_AUTHORIZATION='Bearer ' + second_token)
        response = self.unauthenticated_user.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_a_recipe_by_id(self):
        post_response = self.postRecipes(0,2)
        # Last recipe post id
        id = post_response.data['id']
        url = reverse('recipe-view-retrieve-update-destroy', args=[id])
        
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    
    def test_update_a_recipe_by_id(self):
        post_response = self.postRecipes(0,2)
        # Last recipe post id
        id = post_response.data['id']
        url = reverse('recipe-view-retrieve-update-destroy', args=[id])
        update_data = self.recipes[1]
        update_data["name"] = "Honey Soy Chicken"
        
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.assertTrue(
            Recipe.objects.filter(
                id=response.data['id'],
                name='Honey Soy Chicken'
            ).exists()
        )

    def test_get_random_active_recipe(self):
        post_response = self.postRecipes(0,3)
        # Last recipe post id
        id = post_response.data['id']
        # Used it
        Recipe.objects.filter(id=id).update(state='used')
        
        url = reverse("retrieve-random-active-recipe")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(response.data['name'], ['Trung duc thit', 'Soy Chicken'])

    def test_reset_all_recipes_state(self):
        self.postRecipes(0,3)
        Recipe.objects.filter(user__username=self.username).update(state='used')
        url = reverse('refresh-all-recipes-state')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(
            Recipe.objects.filter(user__username=self.username, state='used').exists()
        )

    def test_get_recipe_stats(self):
        last = self.postRecipes(0,3).data['id']
        Recipe.objects.filter(id=last).update(state='used')
        url = reverse('get-recipe-nerd-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        meat_stats = response.data['meat_type_stats']
        self.assertEqual(2, len(meat_stats))
        chicken = meat_stats[0]
        self.assertEqual(2, chicken['total'])
        self.assertEqual(1, chicken['active'])
        
    def test_get_generated_recipe_by_url_valid_link(self):
        data = {
            "url": 'https://www.justonecookbook.com/gyudon/'
        }
        url = reverse('generate-recipe-from-url')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Gyudon', response.data['name'])
    
    def test_get_generated_recipe_by_url_invalid_link(self):
        data = {
            "url": 'https://www.youtube.com/watch?v=YgoCC-GTQcA'
        }
        url = reverse('generate-recipe-from-url')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_recipe_by_ingredients(self):
        self.postRecipes(0,3)
        url = reverse('recipe-view-create-destroy')
        response = self.client.get(url, {'ingredients': 'chicken thighs, soy sauce'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        first = response.data[0]
        self.assertEqual(first['name'], 'Soy Chicken')
        self.assertIn('accuracy', first)
        self.assertEqual(first['accuracy'], 100)
    
    def test_get_recipe_by_search_and_order_filter(self):
        self.postRecipes(0,3)
        url = reverse('recipe-view-create-destroy')
        response = self.client.get(url, {'search': 'chicken', 'ordering': 'name'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        first = response.data[0]
        self.assertEqual(first['name'], 'Oyakodon')
        self.assertEqual(response.data[1]['name'], 'Soy Chicken')

                