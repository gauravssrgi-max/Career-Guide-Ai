"""
Career Guide AI — URL Routing (Django REST API)
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Health
    path('health/', views.health_check, name='health'),
    
    # Auth
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', views.profile, name='profile'),
    
    # Careers
    path('careers/', views.career_list, name='career-list'),
    path('careers/<int:pk>/', views.career_detail, name='career-detail'),
    path('careers/compare/', views.career_compare, name='career-compare'),
    
    # Survey
    path('survey/submit/', views.submit_survey, name='survey-submit'),
    path('survey/result/', views.survey_result, name='survey-result'),
    
    # AI
    path('ai/chat/', views.ai_chat, name='ai-chat'),
    
    # User
    path('user/dashboard/', views.dashboard, name='dashboard'),
    path('user/badges/', views.badges, name='badges'),
]
