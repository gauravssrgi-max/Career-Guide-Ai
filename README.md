# 🎯 Career Guide AI

A full-stack AI-powered career guidance platform that helps users discover their ideal career path.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **AI**: OpenAI API (GPT-4o-mini)
- **Auth**: JWT + Google OAuth

## Quick Start

### 1. Setup Backend
```bash
cd server
npm install
```

Edit `.env` with your credentials:
- `MONGODB_URI` — Your MongoDB Atlas connection string
- `OPENAI_API_KEY` — Your OpenAI API key
- `JWT_SECRET` — Any random secret string

### 2. Seed Database
```bash
cd server
npm run seed
```

### 3. Start Backend
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

### 4. Start Frontend
```bash
cd client
npm run dev
```
App runs on `http://localhost:3000`

## Features
- 🧠 AI-powered career recommendations
- 📋 Interactive multi-step career survey
- 💬 AI Chat Mentor (ChatGPT-style)
- 🗺️ Career roadmaps with timelines
- 💰 Cost estimation & budget alternatives
- ⚖️ Career comparison tool
- 🏆 Gamification (badges, XP, levels)
- 🌙 Dark/Light mode
- 🔐 JWT Authentication

## API Endpoints
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `POST /api/survey/submit` — Submit survey
- `GET /api/careers` — List careers
- `POST /api/ai/chat` — AI chat
- `GET /api/user/dashboard` — Dashboard data
