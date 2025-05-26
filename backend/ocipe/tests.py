from rest_framework.test import APITestCase
from django.urls import reverse

class AuthenticatedAPITestCase(APITestCase):
    def register_and_authenticate(self, test_user_number=1):
        self.username=f'testuser{test_user_number}' 
        self.password=f'testpass{test_user_number}'
        # Register user
        register_url = reverse('register')
        self.client.post(register_url, {'username': self.username, 'password': self.password})
        # Obtain JWT token
        token_url = reverse('token_obtain_pair')
        response = self.client.post(token_url, {'username': self.username, 'password': self.password})
        tokens = response.data
        return tokens