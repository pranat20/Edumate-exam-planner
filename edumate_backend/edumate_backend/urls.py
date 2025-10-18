from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

from planner.views import (
    SubjectViewSet,
    TaskViewSet,
    NotificationViewSet,
    home,
    progress_report,
    signup,
    ProfileView,
    ChangePasswordView,
    SummarizerAPIView, MockQuestionsAPIView, MCQGeneratorAPIView, PYQAnalyzeAPIView,  
)

router = routers.DefaultRouter()
router.register(r"subjects", SubjectViewSet, basename="subjects")
router.register(r"tasks", TaskViewSet, basename="tasks")
router.register(r"notifications", NotificationViewSet, basename="notifications")



urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/progress/", progress_report, name="progress_report"),
    path("api/signup/", signup, name="signup"),
    path("api/profile/", ProfileView.as_view(), name="profile"),
    path("api/change-password/", ChangePasswordView.as_view(), name="change_password"),
    # Tools
    path('api/tools/summarize/', SummarizerAPIView.as_view(), name='tools-summarize'),
    path('api/tools/mock/', MockQuestionsAPIView.as_view(), name='tools-mock'),
    path('api/tools/mcq/', MCQGeneratorAPIView.as_view(), name='tools-mcq'),
    path('api/tools/pyq/', PYQAnalyzeAPIView.as_view(), name='tools-pyq'),
 

    
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api-auth/", include("rest_framework.urls")),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
