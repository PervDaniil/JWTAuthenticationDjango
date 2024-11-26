from django.contrib import admin
from django.urls import path
from api.users.views import UserRegisterView, UserLoginView, UserInfoView, UserLogoutView


urlpatterns = [
    path('api/auth/register/', UserRegisterView.as_view()),
    path('api/auth/logout/', UserLogoutView.as_view()),
    path('api/auth/login/', UserLoginView.as_view()),
    path('api/auth/user/', UserInfoView.as_view()),
    path('admin/', admin.site.urls),
]
