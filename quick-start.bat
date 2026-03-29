@echo off
echo ========================================
echo     ClinicMind AI - Quick Start
echo ========================================
echo.
echo This will start all services...
echo.

REM Start frontend and API
echo Starting Frontend + API Server...
start "Frontend + API" cmd /k "pnpm dev"

REM Wait a bit then start AI service
timeout /t 5 /nobreak >nul
echo Starting AI Service...
start "AI Service" cmd /k "cd backend\ai-service && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

echo.
echo ========================================
echo     Services Started!
echo ========================================
echo.
echo Patient App:     http://localhost:3000
echo Hospital App:    http://localhost:3001  
echo Admin App:       http://localhost:3002
echo API Server:      http://localhost:5000
echo AI Service:      http://localhost:8000
echo.
echo Opening applications in browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000
start http://localhost:3001
start http://localhost:3002
echo.
echo Done! Keep this window open.
pause
