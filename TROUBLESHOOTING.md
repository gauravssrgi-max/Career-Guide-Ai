# 🔧 Troubleshooting: "Failed to fetch" Error

## Problem
Frontend shows error: `TypeError: Failed to fetch` when trying to connect to backend API.

## Root Cause
The frontend (Next.js on port 3000) cannot connect to the backend (Express on port 5000).

---

## ✅ Solution Steps

### Step 1: Verify Backend is Running

Open a terminal and check:
```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected
✅ Gemini AI connected
```

If you see errors, continue to Step 2.

---

### Step 2: Check Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://your_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=AIzaSyAry7kyD0Z0L-tRaGKHq9JC_qvGsMgRS_U
AI_PROVIDER=gemini
CLIENT_URL=http://localhost:3000
```

**Frontend** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

### Step 3: Test Backend Directly

Open browser and visit:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "success": true,
  "message": "API running",
  "port": 5000
}
```

If this doesn't work, backend is not running properly.

---

### Step 4: Check CORS Configuration

In `server/src/index.js`, verify CORS is configured:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
```

---

### Step 5: Restart Both Servers

**Option A: Use the startup script**
```bash
# From project root
start-servers.bat
```

**Option B: Manual restart**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

---

### Step 6: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use Ctrl+Shift+Delete to clear cache

---

### Step 7: Check Firewall/Antivirus

Some antivirus software blocks localhost connections:
- Temporarily disable antivirus
- Add exception for Node.js
- Check Windows Firewall settings

---

## 🔍 Debugging Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] MongoDB is connected (check server logs)
- [ ] Gemini API key is set in server/.env
- [ ] NEXT_PUBLIC_API_URL is set in client/.env.local
- [ ] No other process is using port 5000
- [ ] CORS is configured correctly
- [ ] Browser cache is cleared
- [ ] No firewall blocking localhost

---

## 🧪 Test API Connection

### Using Browser Console

Open DevTools (F12) and run:
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

### Using curl

```bash
curl http://localhost:5000/api/health
```

### Using Postman

1. Create new request
2. GET http://localhost:5000/api/health
3. Send

---

## 🚨 Common Issues

### Issue 1: Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in server/.env
PORT=5001
```

### Issue 2: MongoDB Connection Failed
```
MongooseError: Could not connect to MongoDB
```

**Solution:**
- Check MONGODB_URI in server/.env
- Verify MongoDB Atlas IP whitelist
- Test connection string
- Use local MongoDB: `mongodb://localhost:27017/career-guide-ai`

### Issue 3: Gemini API Key Invalid
```
Error: Invalid API key
```

**Solution:**
- Get new key from https://makersuite.google.com/app/apikey
- Update GEMINI_API_KEY in server/.env
- Restart backend server

### Issue 4: CORS Error
```
Access to fetch blocked by CORS policy
```

**Solution:**
- Verify CLIENT_URL in server/.env matches frontend URL
- Check CORS configuration in server/src/index.js
- Restart backend server

---

## 📊 Expected Server Logs

### Backend (Successful Start)
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected
✅ Gemini AI connected (gemini-flash-lite-latest)
✅ Career Copilot: Gemini AI connected
```

### Frontend (Successful Start)
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
- event compiled client and server successfully
```

---

## 🔄 Quick Reset

If nothing works, try a complete reset:

```bash
# 1. Stop all servers (Ctrl+C in terminals)

# 2. Clear node_modules
cd server
rmdir /s /q node_modules
npm install

cd ../client
rmdir /s /q node_modules
npm install

# 3. Clear Next.js cache
rmdir /s /q .next

# 4. Restart servers
cd ../server
npm run dev

# In new terminal
cd client
npm run dev
```

---

## 📞 Still Not Working?

### Check Server Logs
Look for errors in the terminal where backend is running.

### Check Browser Console
Open DevTools (F12) → Console tab → Look for errors

### Check Network Tab
Open DevTools (F12) → Network tab → See failed requests

### Verify Environment
```bash
# Backend
cd server
node -e "console.log(require('dotenv').config())"

# Frontend
cd client
echo %NEXT_PUBLIC_API_URL%
```

---

## ✅ Success Indicators

You'll know it's working when:

1. Backend shows: `🚀 Server running on http://localhost:5000`
2. Frontend shows: `ready started server on 0.0.0.0:3000`
3. Browser console has no errors
4. http://localhost:5000/api/health returns JSON
5. Frontend loads without "Failed to fetch" error
6. You can login/register successfully

---

## 🎯 Next Steps After Fix

1. Test authentication (login/register)
2. Navigate to /copilot
3. Create your profile
4. Generate complete system
5. Explore all modules

---

## 💡 Pro Tips

- Always check both terminal windows for errors
- Keep DevTools open while developing
- Use `npm run dev` not `npm start` for development
- Restart servers after changing .env files
- Clear browser cache when things act weird

---

**Need more help?** Check the main README or server logs for detailed error messages.
