from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserRegistrationSerializer
from fridge.models import Fridge
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from rest_framework_simplejwt.views import TokenObtainPairView

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Each user is provided with ONE fridge object 
            Fridge.objects.create(user=user)
            return Response({
              "message": "User registered successfully"
            }, status=status.HTTP_201_CREATED)
        # Username already exists
        return Response({"username": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            refresh = response.data.pop('refresh')
            # Set refresh token in HTTP-only cookie
            response.set_cookie(
                key='refresh_token',
                value=refresh,
                httponly=True,
                secure=False,  #HTTPs for production
                samesite='Lax',
                max_age=3600 * 24 * 30 # 30 Days
            )
        return response

class CookieTokenRefreshView(APIView):
    def post(self, request):
        refresh_cookie = request.COOKIES.get("refresh_token")
        try:
            token = RefreshToken(refresh_cookie)
            access = str(token.access_token)
        except TokenError as e:
            raise TokenError("Refresh token is invalid or expired")
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({
            'access': access
        })
    
class LogoutView(APIView):
    def post(self, request):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie('refresh_token')
        return response