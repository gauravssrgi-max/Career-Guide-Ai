"""
Career Guide AI — Django Models
Database models for Users, Surveys, Careers
"""
from django.db import models
from django.contrib.auth.models import AbstractUser
import json


class User(AbstractUser):
    """Extended user model with career guidance features"""
    
    PERSONALITY_CHOICES = [
        ('introvert', 'Introvert'),
        ('extrovert', 'Extrovert'),
        ('ambivert', 'Ambivert'),
    ]
    
    personality_type = models.CharField(max_length=20, choices=PERSONALITY_CHOICES, blank=True)
    interests = models.JSONField(default=list, blank=True)
    skills = models.JSONField(default=list, blank=True)
    level = models.IntegerField(default=1)
    xp = models.IntegerField(default=0)
    badges = models.JSONField(default=list, blank=True)
    saved_careers = models.ManyToManyField('Career', blank=True, related_name='saved_by')
    survey_completed = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.username} (Level {self.level})"
    
    def add_xp(self, points):
        """Add XP and handle level-up logic"""
        self.xp += points
        xp_needed = self.level * 100
        if self.xp >= xp_needed:
            self.level += 1
            self.badges.append({
                'name': f'Level {self.level} Achiever',
                'icon': '🏆',
            })
        self.save()
    
    def add_badge(self, name, icon):
        """Add a badge if not already earned"""
        if not any(b.get('name') == name for b in self.badges):
            self.badges.append({'name': name, 'icon': icon})
            self.save()
            return True
        return False


class Career(models.Model):
    """Career path with detailed information"""
    
    CATEGORY_CHOICES = [
        ('technology', 'Technology'),
        ('medical', 'Medical & Health'),
        ('business', 'Business & Finance'),
        ('creative', 'Arts & Design'),
        ('science', 'Science & Research'),
        ('government', 'Government & Law'),
    ]
    
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    icon = models.CharField(max_length=10, default='💼')
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)
    
    # Salary information
    salary_entry_india = models.CharField(max_length=50, blank=True)
    salary_mid_india = models.CharField(max_length=50, blank=True)
    salary_senior_india = models.CharField(max_length=50, blank=True)
    salary_entry_abroad = models.CharField(max_length=50, blank=True)
    
    # Metrics
    difficulty = models.IntegerField(default=3, help_text="1-5 scale")
    risk_score = models.IntegerField(default=30, help_text="0-100 scale")
    growth_rate = models.CharField(max_length=30, blank=True)
    demand_prediction = models.CharField(max_length=30, default='growing')
    automation_risk = models.CharField(max_length=30, default='low')
    
    # Details
    skills_required = models.JSONField(default=list)
    roadmap = models.JSONField(default=list)
    cost_estimate = models.JSONField(default=dict)
    related_exams = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'careers'
        ordering = ['title']
    
    def __str__(self):
        return f"{self.icon} {self.title} ({self.category})"


class Survey(models.Model):
    """User survey responses and AI analysis"""
    
    CONFUSION_CHOICES = [
        ('none', 'Not Confused'),
        ('mild', 'Mildly Confused'),
        ('moderate', 'Moderately Confused'),
        ('high', 'Very Confused'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='surveys')
    answers = models.JSONField(default=dict)
    confusion_level = models.CharField(max_length=20, choices=CONFUSION_CHOICES, default='none')
    ai_analysis = models.TextField(blank=True)
    recommended_careers = models.ManyToManyField(Career, blank=True)
    is_quick_test = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'surveys'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Survey by {self.user.username} ({self.created_at.strftime('%Y-%m-%d')})"


class ChatMessage(models.Model):
    """Store chat conversation history"""
    
    ROLE_CHOICES = [
        ('user', 'User'),
        ('assistant', 'Assistant'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."
