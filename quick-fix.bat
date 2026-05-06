@echo off
echo ========================================
echo   Career Guide AI - Quick Fix
echo ========================================
echo.

echo This script will:
echo 1. Kill existing Node processes
echo 2. Verify environment variables
echo 3. Restart servers
echo.
pause

echo.
echo [1/5] Stopping existing Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak > nul

echo.
echo [2/5] Checking Backend .env file...
if not exist "server\.env" (
    echo ERROR: server\.env not found!
    echo Please create it with required variables.
    pause
    exit /b 1
)

echo.
echo [3/5] Checking Frontend .env.local file...
if not exist "client\.env.local" (
    echo ERROR: client\.env.local not found!
    echo Please create it with NEXT_PUBLIC_API_URL
    pause
    exit /b 1
)

echo.
echo [4/5] Testing Backend connection...
cd server
start "Backend Test" cmd /k "npm run dev"
timeout /t 5 /nobreak > nul

echo.
echo [5/5] Starting Frontend...
cd ..\client
start "Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers Restarted!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Wait 10 seconds, then test:
echo http://localhost:5000/api/health
echo.
echo If you still see errors:
echo 1. Check the Backend Test window for errors
echo 2. Read TROUBLESHOOTING.md
echo 3. Verify API keys in server\.env
echo.
pause
