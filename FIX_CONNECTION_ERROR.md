# 🚨 QUICK FIX: "Failed to fetch" Error

## The Problem
Your frontend can't connect to the backend API.

## The Solution (2 minutes)

### Step 1: Run the Quick Fix Script
```bash
# Double-click this file:
quick-fix.bat
```

This will:
- Stop all Node processes
- Restart backend on port 5000
- Restart frontend on port 3000

### Step 2: Wait 10 Seconds
Let the servers fully start up.

### Step 3: Test Backend
Open browser and visit:
```
http://localhost:5000/api/health
```

You should see:
```json
{"success": true, "message": "API running", "port": 5000}
```

### Step 4: Refresh Frontend
Go to:
```
http://localhost:3000
```

Press `Ctrl + Shift + R` to hard refresh.

---

## ✅ If It Works
You should see:
- No "Failed to fetch" errors
- Login/Register works
- Career Copilot accessible

---

## ❌ If It Still Doesn't Work

### Check Backend Terminal
Look for these messages:
```
✅ MongoDB connected
✅ Gemini AI connected
🚀 Server running on http://localhost:5000
```

If you see errors:

**MongoDB Error?**
- Check MONGODB_URI in `server/.env`
- Make sure MongoDB Atlas IP whitelist includes your IP

**Gemini API Error?**
- Check GEMINI_API_KEY in `server/.env`
- Get new key: https://makersuite.google.com/app/apikey

**Port 5000 in use?**
- Change PORT in `server/.env` to 5001
- Update NEXT_PUBLIC_API_URL in `client/.env.local` to http://localhost:5001/api

---

## 🔍 Manual Check

### 1. Backend Running?
```bash
cd server
npm run dev
```

Should show: `🚀 Server running on http://localhost:5000`

### 2. Frontend Running?
```bash
cd client
npm run dev
```

Should show: `ready started server on 0.0.0.0:3000`

### 3. Environment Variables Set?

**server/.env** must have:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
```

**client/.env.local** must have:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📚 More Help

- **Detailed Guide**: Read `TROUBLESHOOTING.md`
- **Full Docs**: Read `CAREER_COPILOT_README.md`
- **Quick Start**: Read `QUICK_START.md`

---

## 🎯 Common Fixes

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change PORT in server/.env |
| MongoDB error | Check MONGODB_URI |
| Gemini API error | Check GEMINI_API_KEY |
| CORS error | Check CLIENT_URL in server/.env |
| Cache issues | Clear browser cache (Ctrl+Shift+Delete) |

---

## 💡 Pro Tip

Always keep 2 terminal windows open:
1. **Terminal 1**: `cd server && npm run dev`
2. **Terminal 2**: `cd client && npm run dev`

Watch for errors in both!

---

**Still stuck?** Check the server terminal for specific error messages and search for them in TROUBLESHOOTING.md
