"""
Career Guide AI — Django Admin Configuration
"""
from django.contrib import admin
from .models import Career, Survey, ChatMessage, User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'level', 'xp', 'survey_completed', 'date_joined']
    list_filter = ['level', 'survey_completed', 'personality_type']
    search_fields = ['username', 'email']

@admin.register(Career)
class CareerAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'difficulty', 'risk_score', 'growth_rate', 'demand_prediction']
    list_filter = ['category', 'difficulty', 'demand_prediction']
    search_fields = ['title', 'description']

@admin.register(Survey)
class SurveyAdmin(admin.ModelAdmin):
    list_display = ['user', 'confusion_level', 'is_quick_test', 'created_at']
    list_filter = ['confusion_level', 'is_quick_test']

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'created_at']
    list_filter = ['role']
