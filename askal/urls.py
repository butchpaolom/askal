from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/api/', include('users.urls')),
    path('ask/api/', include('ask.urls')),
    path('', include('web.urls')),
    path('api_auth/', include('rest_framework.urls')),
    path('api/token', TokenObtainPairView.as_view()),
    path('api/token/refresh', TokenRefreshView.as_view()),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
