from .models import CustomUser
from rest_framework import status
from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import AuthenticationFailed, InvalidToken


class UserRegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        confirmed_password = request.data.get('confirmed_password')
        
        if not username:
            return Response({'info' : 'Username cannot be blank!'}, status=status.HTTP_400_BAD_REQUEST)
        
        if password != confirmed_password:
            return Response({'info' : 'Passwords are different!'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.create_user(
                username=username, password=password
            )
            
            refresh_token = RefreshToken.for_user(user)
            access_token = refresh_token.access_token
            
            return Response({'info' : 'Account has created successfully!',
                            'access' : str(access_token),
                            'refresh' : str(refresh_token)},
                            status=status.HTTP_201_CREATED)

            
        except IntegrityError as Exc:
            return Response({'info' : 'An account with this username already exists!'}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as Exc:
            print(Exc)
            return Response({'info' : 'Internal server error!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            
            
class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username:
            return Response({'info' : 'Username is required!'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not password:
            return Response({'info' : 'Password is required!'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = CustomUser.objects.filter(username = username).first()
            
            if user:
                if user.check_password(password):
                    refresh_token = RefreshToken.for_user(user)
                    access_token = refresh_token.access_token
                    
                    return Response({'info' : 'You have logged in successfully!',
                                    'access' : str(access_token),
                                    'refresh' : str(refresh_token)},
                                    status=status.HTTP_200_OK)

            return Response({'info' : 'Invalid credentials!'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as Exc:
            return Response({'info' : 'Internal server error!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            


class UserLogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response({'info' : 'Refresh token is required!'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            UserToken = RefreshToken(refresh_token)
            UserToken.blacklist()
            return Response({'info' : 'You have successfully logged out!'}, status=status.HTTP_200_OK)
        
        except InvalidToken:
            return Response({'info' : 'Token is invalid!'}, status=status.HTTP_400_BAD_REQUEST)
        
        except AuthenticationFailed:
            return Response({'info' : 'Token is invalid or expired!'}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as Exc:
            return Response({'info' : 'Internal server error!'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class UserInfoView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response({'user' : {'username' : request.user.username, 'is_authenticated' : True}}, status=status.HTTP_200_OK)
        return Response({'user' : {'username' : 'AnonymousUser', 'is_authenticated' : False}})
            
            
