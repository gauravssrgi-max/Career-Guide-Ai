@echo off
echo ========================================
echo   Career Guide AI - Starting Servers
echo ========================================
echo.

echo [1/4] Checking Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    pause
    exit /b 1
)

echo.
echo [2/4] Checking MongoDB connection...
echo (Make sure MongoDB is running or using MongoDB Atlas)
echo.

echo [3/4] Starting Backend Server (Port 5000)...
cd server
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo [4/4] Starting Frontend Server (Port 3000)...
cd ..\client
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
