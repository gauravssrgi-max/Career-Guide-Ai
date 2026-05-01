"""
Career Guide AI — Django REST Serializers
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Career, Survey, ChatMessage

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """User serializer with gamification fields"""
    xp_to_next_level = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'personality_type', 'interests', 'skills', 'level', 'xp',
                  'xp_to_next_level', 'badges', 'survey_completed', 'date_joined']
        read_only_fields = ['id', 'level', 'xp', 'badges', 'date_joined']
    
    def get_xp_to_next_level(self, obj):
        return (obj.level * 100) - obj.xp


class RegisterSerializer(serializers.ModelSerializer):
    """Registration serializer"""
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.add_badge('Welcome Explorer', '🌟')
        user.add_xp(10)
        return user


class LoginSerializer(serializers.Serializer):
    """Login serializer"""
    email = serializers.EmailField()
    password = serializers.CharField()


class CareerSerializer(serializers.ModelSerializer):
    """Career serializer with all details"""
    salary_range = serializers.SerializerMethodField()
    
    class Meta:
        model = Career
        fields = '__all__'
    
    def get_salary_range(self, obj):
        return {
            'india': {
                'entry': obj.salary_entry_india,
                'mid': obj.salary_mid_india,
                'senior': obj.salary_senior_india,
            },
            'abroad': {'entry': obj.salary_entry_abroad},
        }


class CareerListSerializer(serializers.ModelSerializer):
    """Lightweight career serializer for list views"""
    class Meta:
        model = Career
        fields = ['id', 'title', 'category', 'icon', 'short_description',
                  'salary_entry_india', 'difficulty', 'growth_rate', 'demand_prediction']


class SurveySerializer(serializers.ModelSerializer):
    """Survey serializer"""
    class Meta:
        model = Survey
        fields = ['id', 'answers', 'confusion_level', 'ai_analysis',
                  'is_quick_test', 'created_at']
        read_only_fields = ['id', 'ai_analysis', 'created_at']


class SurveySubmitSerializer(serializers.Serializer):
    """Survey submission serializer"""
    answers = serializers.DictField()
    confusion_level = serializers.ChoiceField(
        choices=['none', 'mild', 'moderate', 'high'],
        default='none'
    )
    is_quick_test = serializers.BooleanField(default=False)


class ChatSerializer(serializers.Serializer):
    """Chat message serializer"""
    messages = serializers.ListField(
        child=serializers.DictField()
    )


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'created_at']
