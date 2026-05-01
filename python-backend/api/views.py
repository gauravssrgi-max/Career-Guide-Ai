"""
Career Guide AI — Django REST API Views
All API endpoints for career guidance platform
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    CareerSerializer, CareerListSerializer,
    SurveySerializer, SurveySubmitSerializer, ChatSerializer
)
from .models import Career, Survey, ChatMessage
from .ai_service import CareerAIService

User = get_user_model()
ai_service = CareerAIService()


# ─── Auth Views ───────────────────────────────────────────────

@api_view(['POST'])
def register(request):
    """Register a new user"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'data': {
                'user': UserSerializer(user).data,
                'token': str(tokens.access_token),
                'refresh': str(tokens),
            }
        }, status=status.HTTP_201_CREATED)
    return Response({'success': False, 'errors': serializer.errors}, status=400)


@api_view(['POST'])
def login_view(request):
    """Login with email and password"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None
        
        if user:
            tokens = RefreshToken.for_user(user)
            return Response({
                'success': True,
                'data': {
                    'user': UserSerializer(user).data,
                    'token': str(tokens.access_token),
                    'refresh': str(tokens),
                }
            })
        return Response({'success': False, 'message': 'Invalid credentials'}, status=401)
    return Response({'success': False, 'errors': serializer.errors}, status=400)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    """Get user profile"""
    return Response({
        'success': True,
        'data': UserSerializer(request.user).data
    })


# ─── Career Views ─────────────────────────────────────────────

@api_view(['GET'])
def career_list(request):
    """List all careers with optional category filter"""
    category = request.query_params.get('category', None)
    careers = Career.objects.all()
    if category:
        careers = careers.filter(category=category)
    
    serializer = CareerListSerializer(careers, many=True)
    return Response({'success': True, 'data': serializer.data})


@api_view(['GET'])
def career_detail(request, pk):
    """Get career details by ID"""
    try:
        career = Career.objects.get(pk=pk)
        serializer = CareerSerializer(career)
        return Response({'success': True, 'data': {'career': serializer.data}})
    except Career.DoesNotExist:
        return Response({'success': False, 'message': 'Career not found'}, status=404)


@api_view(['POST'])
def career_compare(request):
    """Compare multiple careers side by side"""
    career_ids = request.data.get('careerIds', [])
    if len(career_ids) < 2:
        return Response({'success': False, 'message': 'Select at least 2 careers'}, status=400)
    
    careers = Career.objects.filter(pk__in=career_ids)
    serializer = CareerSerializer(careers, many=True)
    return Response({'success': True, 'data': serializer.data})


# ─── Survey Views ─────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submit_survey(request):
    """Submit career survey and get AI recommendations"""
    serializer = SurveySubmitSerializer(data=request.data)
    if serializer.is_valid():
        answers = serializer.validated_data['answers']
        confusion_level = serializer.validated_data['confusion_level']
        
        # Get AI recommendations
        recommendations = ai_service.recommend_careers({
            **answers,
            'confusion_level': confusion_level,
        })
        
        # Save survey
        survey = Survey.objects.create(
            user=request.user,
            answers=answers,
            confusion_level=confusion_level,
            ai_analysis=recommendations.get('analysis', ''),
            is_quick_test=serializer.validated_data.get('is_quick_test', False),
        )
        
        # Award XP
        request.user.add_xp(30 if not survey.is_quick_test else 15)
        request.user.survey_completed = True
        request.user.add_badge('Survey Completed', '📋')
        request.user.save()
        
        return Response({
            'success': True,
            'data': {
                'survey': SurveySerializer(survey).data,
                'recommendations': recommendations,
            }
        }, status=201)
    return Response({'success': False, 'errors': serializer.errors}, status=400)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def survey_result(request):
    """Get latest survey results"""
    survey = Survey.objects.filter(user=request.user).first()
    if not survey:
        return Response({'success': False, 'message': 'No survey found'}, status=404)
    
    recommendations = ai_service.recommend_careers({
        **survey.answers,
        'confusion_level': survey.confusion_level,
    })
    
    return Response({
        'success': True,
        'data': {
            'survey': SurveySerializer(survey).data,
            'recommendations': recommendations,
        }
    })


# ─── AI Chat Views ────────────────────────────────────────────

@api_view(['POST'])
def ai_chat(request):
    """Chat with AI career mentor"""
    serializer = ChatSerializer(data=request.data)
    if serializer.is_valid():
        messages = serializer.validated_data['messages']
        result = ai_service.chat(messages)
        return Response({'success': True, 'data': result})
    return Response({'success': False, 'errors': serializer.errors}, status=400)


# ─── Dashboard Views ──────────────────────────────────────────

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard(request):
    """Get user dashboard data"""
    user = request.user
    surveys_count = Survey.objects.filter(user=user).count()
    latest_survey = Survey.objects.filter(user=user).first()
    
    return Response({
        'success': True,
        'data': {
            'user': UserSerializer(user).data,
            'savedCareers': CareerListSerializer(user.saved_careers.all(), many=True).data,
            'surveysCompleted': surveys_count,
            'latestSurvey': SurveySerializer(latest_survey).data if latest_survey else None,
            'stats': {
                'totalBadges': len(user.badges),
                'level': user.level,
                'xp': user.xp,
            },
        }
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def badges(request):
    """Get all badges with earned status"""
    all_badges = [
        {'name': 'Welcome Explorer', 'icon': '🌟', 'description': 'Joined Career Guide AI'},
        {'name': 'Survey Completed', 'icon': '📋', 'description': 'Completed first survey'},
        {'name': 'Career Collector', 'icon': '📚', 'description': 'Saved 5 careers'},
        {'name': 'Chat Explorer', 'icon': '💬', 'description': 'Had 10 conversations'},
        {'name': 'Level 2 Achiever', 'icon': '🏆', 'description': 'Reached level 2'},
    ]
    
    user_badge_names = [b.get('name') for b in request.user.badges]
    for badge in all_badges:
        badge['earned'] = badge['name'] in user_badge_names
    
    return Response({'success': True, 'data': all_badges})


# ─── Health Check ─────────────────────────────────────────────

@api_view(['GET'])
def health_check(request):
    """API health check endpoint"""
    return Response({
        'status': 'ok',
        'service': 'Career Guide AI (Django)',
        'version': '1.0.0',
        'framework': 'Django REST Framework',
        'python': True,
    })
