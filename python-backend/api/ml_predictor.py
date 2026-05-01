"""
Career Guide AI — Machine Learning Career Predictor
Uses scikit-learn to predict best career matches based on user profile
"""
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import json
import os


class CareerPredictor:
    """
    ML-based career prediction using Random Forest Classifier.
    Trained on synthetic career-profile data to predict best career matches.
    """
    
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1,
        )
        self.label_encoder = LabelEncoder()
        self.feature_names = [
            'interest_tech', 'interest_medical', 'interest_business',
            'interest_creative', 'interest_science', 'interest_govt',
            'skill_coding', 'skill_communication', 'skill_creativity',
            'skill_mathematics', 'skill_leadership', 'skill_analytical',
            'personality_introvert', 'personality_extrovert', 'personality_ambivert',
            'budget_low', 'budget_medium', 'budget_high',
            'confusion_level',
        ]
        self.career_labels = [
            'Software Engineer', 'Data Scientist', 'AI/ML Engineer',
            'Doctor (MBBS)', 'Pharmacist', 'Biotech Researcher',
            'Management Consultant', 'Chartered Accountant', 'Investment Banker',
            'UX/UI Designer', 'Content Creator', 'Graphic Designer',
            'IAS Officer', 'Defense Officer',
            'Research Scientist', 'Space Scientist',
        ]
        self._train_model()
    
    def _generate_training_data(self):
        """Generate synthetic training data for career prediction"""
        np.random.seed(42)
        n_samples = 1000
        X = []
        y = []
        
        # Define career-interest-skill mappings
        career_profiles = {
            'Software Engineer': {'interests': [1,0,0,0,0,0], 'skills': [1,0,0,1,0,1], 'personality': [1,0,0]},
            'Data Scientist': {'interests': [1,0,0,0,1,0], 'skills': [1,0,0,1,0,1], 'personality': [1,0,0]},
            'AI/ML Engineer': {'interests': [1,0,0,0,1,0], 'skills': [1,0,0,1,0,1], 'personality': [1,0,0]},
            'Doctor (MBBS)': {'interests': [0,1,0,0,1,0], 'skills': [0,1,0,0,1,0], 'personality': [0,0,1]},
            'Pharmacist': {'interests': [0,1,0,0,1,0], 'skills': [0,0,0,1,0,1], 'personality': [1,0,0]},
            'Biotech Researcher': {'interests': [1,1,0,0,1,0], 'skills': [0,0,0,1,0,1], 'personality': [1,0,0]},
            'Management Consultant': {'interests': [0,0,1,0,0,0], 'skills': [0,1,0,1,1,1], 'personality': [0,1,0]},
            'Chartered Accountant': {'interests': [0,0,1,0,0,0], 'skills': [0,0,0,1,0,1], 'personality': [1,0,0]},
            'Investment Banker': {'interests': [0,0,1,0,0,0], 'skills': [0,1,0,1,1,1], 'personality': [0,1,0]},
            'UX/UI Designer': {'interests': [1,0,0,1,0,0], 'skills': [0,0,1,0,0,0], 'personality': [0,0,1]},
            'Content Creator': {'interests': [0,0,0,1,0,0], 'skills': [0,1,1,0,0,0], 'personality': [0,1,0]},
            'Graphic Designer': {'interests': [0,0,0,1,0,0], 'skills': [0,0,1,0,0,0], 'personality': [1,0,0]},
            'IAS Officer': {'interests': [0,0,0,0,0,1], 'skills': [0,1,0,0,1,1], 'personality': [0,1,0]},
            'Defense Officer': {'interests': [0,0,0,0,0,1], 'skills': [0,0,0,0,1,0], 'personality': [0,1,0]},
            'Research Scientist': {'interests': [0,0,0,0,1,0], 'skills': [0,0,0,1,0,1], 'personality': [1,0,0]},
            'Space Scientist': {'interests': [1,0,0,0,1,0], 'skills': [0,0,0,1,0,1], 'personality': [1,0,0]},
        }
        
        for career, profile in career_profiles.items():
            for _ in range(n_samples // len(career_profiles)):
                # Add noise to features
                interests = [max(0, min(1, v + np.random.normal(0, 0.2))) for v in profile['interests']]
                skills = [max(0, min(1, v + np.random.normal(0, 0.2))) for v in profile['skills']]
                personality = profile['personality']
                budget = [np.random.choice([0, 1]) for _ in range(3)]
                confusion = np.random.uniform(0, 1)
                
                features = interests + skills + personality + budget + [confusion]
                X.append(features)
                y.append(career)
        
        return np.array(X), np.array(y)
    
    def _train_model(self):
        """Train the Random Forest model"""
        X, y = self._generate_training_data()
        y_encoded = self.label_encoder.fit_transform(y)
        self.model.fit(X, y_encoded)
        
        # Calculate training accuracy
        accuracy = self.model.score(X, y_encoded)
        print(f"🤖 ML Career Predictor trained (accuracy: {accuracy:.1%})")
    
    def encode_profile(self, survey_answers):
        """Convert survey answers to feature vector"""
        interests = survey_answers.get('interests', [])
        skills = survey_answers.get('skills', [])
        personality = survey_answers.get('personalityType', 'ambivert')
        budget = survey_answers.get('budget', 'medium')
        confusion = survey_answers.get('confusionLevel', 'none')
        
        # Interest encoding
        interest_map = ['technology', 'medical', 'business', 'creative', 'science', 'government']
        interest_vec = [1.0 if i in interests else 0.0 for i in interest_map]
        
        # Skill encoding
        skill_map = ['coding', 'communication', 'creativity', 'mathematics', 'leadership', 'analytical']
        skill_vec = [1.0 if s in skills else 0.0 for s in skill_map]
        
        # Personality encoding
        personality_vec = [
            1.0 if personality == 'introvert' else 0.0,
            1.0 if personality == 'extrovert' else 0.0,
            1.0 if personality == 'ambivert' else 0.0,
        ]
        
        # Budget encoding
        budget_vec = [
            1.0 if budget == 'low' else 0.0,
            1.0 if budget == 'medium' else 0.0,
            1.0 if budget == 'high' else 0.0,
        ]
        
        # Confusion level
        confusion_map = {'none': 0.0, 'mild': 0.3, 'moderate': 0.6, 'high': 1.0}
        confusion_val = confusion_map.get(confusion, 0.0)
        
        return np.array([interest_vec + skill_vec + personality_vec + budget_vec + [confusion_val]])
    
    def predict(self, survey_answers):
        """
        Predict top 3 career matches with confidence scores.
        
        Args:
            survey_answers: dict with interests, skills, personalityType, budget, confusionLevel
            
        Returns:
            list of dicts with career predictions and probabilities
        """
        features = self.encode_profile(survey_answers)
        probabilities = self.model.predict_proba(features)[0]
        
        # Get top 3 predictions
        top_indices = np.argsort(probabilities)[::-1][:3]
        
        predictions = []
        for idx in top_indices:
            career_name = self.label_encoder.inverse_transform([idx])[0]
            confidence = float(probabilities[idx])
            predictions.append({
                'career': career_name,
                'confidence': round(confidence * 100, 1),
                'probability': round(confidence, 4),
            })
        
        return predictions
    
    def get_feature_importance(self):
        """Get feature importance scores from the model"""
        importances = self.model.feature_importances_
        feature_scores = sorted(
            zip(self.feature_names, importances),
            key=lambda x: x[1],
            reverse=True
        )
        return [{'feature': f, 'importance': round(float(i), 4)} for f, i in feature_scores]


# Usage example
if __name__ == '__main__':
    predictor = CareerPredictor()
    
    # Test prediction
    test_profile = {
        'interests': ['technology', 'science'],
        'skills': ['coding', 'mathematics', 'analytical'],
        'personalityType': 'introvert',
        'budget': 'medium',
        'confusionLevel': 'mild',
    }
    
    print("\n📊 Career Predictions:")
    predictions = predictor.predict(test_profile)
    for i, p in enumerate(predictions, 1):
        print(f"  {i}. {p['career']} — {p['confidence']}% confidence")
    
    print("\n🔍 Feature Importance (Top 5):")
    importance = predictor.get_feature_importance()[:5]
    for f in importance:
        print(f"  • {f['feature']}: {f['importance']}")
