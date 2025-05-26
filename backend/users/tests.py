from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status

class UserAuthTests(APITestCase):
    def test_user_registration(self):
        url = reverse('register')
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='testuser').exists())

    def test_jwt_token_obtain(self):
        # First, create a user
        User.objects.create_user(username='jwtuser', password='jwtpass123')
        url = reverse('token_obtain_pair')
        data = {
            'username': 'jwtuser',
            'password': 'jwtpass123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_jwt_token_refresh(self):
        # Create user and obtain tokens
        User.objects.create_user(username='refreshuser', password='refreshpass123')
        url = reverse('token_obtain_pair')
        data = {
            'username': 'refreshuser',
            'password': 'refreshpass123'
        }
        response = self.client.post(url, data)
        refresh_token = response.data['refresh']

        # Now refresh the access token
        refresh_url = reverse('token_refresh')
        refresh_data = {'refresh': refresh_token}
        refresh_response = self.client.post(refresh_url, refresh_data)
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_response.data)
