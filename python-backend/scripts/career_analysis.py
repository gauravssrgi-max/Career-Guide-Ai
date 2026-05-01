"""
Career Guide AI — Career Data Analysis Script
Generates insights and visualizations from career data using pandas & numpy
"""
import pandas as pd
import numpy as np
import json


def create_career_dataframe():
    """Create a comprehensive career analysis dataframe"""
    careers = [
        {'title': 'Software Engineer', 'category': 'technology', 'entry_salary_lpa': 6, 'senior_salary_lpa': 45, 'difficulty': 3, 'risk_score': 15, 'growth_rate': 22, 'automation_risk': 10, 'demand': 95},
        {'title': 'Data Scientist', 'category': 'technology', 'entry_salary_lpa': 8, 'senior_salary_lpa': 50, 'difficulty': 4, 'risk_score': 12, 'growth_rate': 35, 'automation_risk': 8, 'demand': 92},
        {'title': 'AI/ML Engineer', 'category': 'technology', 'entry_salary_lpa': 10, 'senior_salary_lpa': 70, 'difficulty': 5, 'risk_score': 10, 'growth_rate': 40, 'automation_risk': 5, 'demand': 98},
        {'title': 'Doctor (MBBS)', 'category': 'medical', 'entry_salary_lpa': 8, 'senior_salary_lpa': 60, 'difficulty': 5, 'risk_score': 20, 'growth_rate': 10, 'automation_risk': 12, 'demand': 90},
        {'title': 'Pharmacist', 'category': 'medical', 'entry_salary_lpa': 4, 'senior_salary_lpa': 20, 'difficulty': 3, 'risk_score': 25, 'growth_rate': 8, 'automation_risk': 20, 'demand': 70},
        {'title': 'Management Consultant', 'category': 'business', 'entry_salary_lpa': 10, 'senior_salary_lpa': 80, 'difficulty': 4, 'risk_score': 25, 'growth_rate': 15, 'automation_risk': 18, 'demand': 85},
        {'title': 'Chartered Accountant', 'category': 'business', 'entry_salary_lpa': 8, 'senior_salary_lpa': 50, 'difficulty': 5, 'risk_score': 15, 'growth_rate': 11, 'automation_risk': 30, 'demand': 80},
        {'title': 'UX/UI Designer', 'category': 'creative', 'entry_salary_lpa': 5, 'senior_salary_lpa': 35, 'difficulty': 3, 'risk_score': 20, 'growth_rate': 20, 'automation_risk': 15, 'demand': 88},
        {'title': 'Content Creator', 'category': 'creative', 'entry_salary_lpa': 3, 'senior_salary_lpa': 30, 'difficulty': 3, 'risk_score': 55, 'growth_rate': 25, 'automation_risk': 22, 'demand': 82},
        {'title': 'IAS Officer', 'category': 'government', 'entry_salary_lpa': 8, 'senior_salary_lpa': 25, 'difficulty': 5, 'risk_score': 45, 'growth_rate': 2, 'automation_risk': 5, 'demand': 60},
        {'title': 'Research Scientist', 'category': 'science', 'entry_salary_lpa': 6, 'senior_salary_lpa': 30, 'difficulty': 4, 'risk_score': 30, 'growth_rate': 12, 'automation_risk': 10, 'demand': 75},
        {'title': 'Investment Banker', 'category': 'business', 'entry_salary_lpa': 12, 'senior_salary_lpa': 100, 'difficulty': 5, 'risk_score': 30, 'growth_rate': 12, 'automation_risk': 25, 'demand': 78},
    ]
    return pd.DataFrame(careers)


def analyze_careers():
    """Perform comprehensive career data analysis"""
    df = create_career_dataframe()
    
    print("=" * 60)
    print("🎯 CAREER GUIDE AI — DATA ANALYSIS REPORT")
    print("=" * 60)
    
    # 1. Category-wise analysis
    print("\n📊 Category-wise Average Metrics:")
    print("-" * 50)
    category_stats = df.groupby('category').agg({
        'entry_salary_lpa': 'mean',
        'senior_salary_lpa': 'mean',
        'difficulty': 'mean',
        'risk_score': 'mean',
        'growth_rate': 'mean',
        'demand': 'mean',
    }).round(1)
    print(category_stats.to_string())
    
    # 2. Top careers by salary growth
    print("\n💰 Top Careers by Salary Growth Potential:")
    print("-" * 50)
    df['salary_growth'] = df['senior_salary_lpa'] / df['entry_salary_lpa']
    top_growth = df.nlargest(5, 'salary_growth')[['title', 'entry_salary_lpa', 'senior_salary_lpa', 'salary_growth']]
    for _, row in top_growth.iterrows():
        print(f"  {row['title']}: ₹{row['entry_salary_lpa']}L → ₹{row['senior_salary_lpa']}L ({row['salary_growth']:.1f}x growth)")
    
    # 3. Risk vs Reward analysis
    print("\n⚖️ Risk vs Reward Analysis:")
    print("-" * 50)
    df['reward_score'] = (df['senior_salary_lpa'] * 0.4 + df['growth_rate'] * 0.3 + df['demand'] * 0.3)
    df['risk_reward_ratio'] = (df['reward_score'] / (df['risk_score'] + 1)).round(2)
    best_ratio = df.nlargest(5, 'risk_reward_ratio')[['title', 'risk_score', 'reward_score', 'risk_reward_ratio']]
    for _, row in best_ratio.iterrows():
        print(f"  {row['title']}: Risk={row['risk_score']}, Reward={row['reward_score']:.0f}, Ratio={row['risk_reward_ratio']}")
    
    # 4. Automation risk analysis
    print("\n🤖 Automation Risk (Safest Careers):")
    print("-" * 50)
    safest = df.nsmallest(5, 'automation_risk')[['title', 'automation_risk', 'demand']]
    for _, row in safest.iterrows():
        print(f"  {row['title']}: Automation Risk={row['automation_risk']}%, Demand={row['demand']}%")
    
    # 5. Overall statistics
    print("\n📈 Overall Statistics:")
    print("-" * 50)
    print(f"  Average Entry Salary: ₹{df['entry_salary_lpa'].mean():.1f} LPA")
    print(f"  Average Senior Salary: ₹{df['senior_salary_lpa'].mean():.1f} LPA")
    print(f"  Highest Demand: {df.loc[df['demand'].idxmax(), 'title']} ({df['demand'].max()}%)")
    print(f"  Lowest Risk: {df.loc[df['risk_score'].idxmin(), 'title']} ({df['risk_score'].min()})")
    print(f"  Fastest Growing: {df.loc[df['growth_rate'].idxmax(), 'title']} ({df['growth_rate'].max()}%)")
    
    # 6. Correlation matrix
    print("\n🔗 Key Correlations:")
    print("-" * 50)
    numeric_cols = ['entry_salary_lpa', 'difficulty', 'risk_score', 'growth_rate', 'demand']
    corr = df[numeric_cols].corr()
    print(f"  Salary vs Difficulty: {corr.loc['entry_salary_lpa', 'difficulty']:.2f}")
    print(f"  Growth vs Demand: {corr.loc['growth_rate', 'demand']:.2f}")
    print(f"  Risk vs Salary: {corr.loc['risk_score', 'entry_salary_lpa']:.2f}")
    
    return df


if __name__ == '__main__':
    df = analyze_careers()
