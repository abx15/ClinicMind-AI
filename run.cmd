@echo off
echo ========================================
echo     ClinicMind AI - Development Server
echo ========================================
echo.
echo Starting all services...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed!
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: pnpm is not installed!
    echo Installing pnpm...
    npm install -g pnpm
)

REM Install dependencies if needed
echo Installing dependencies...
pnpm install

REM Check if virtual environment exists for AI service
if not exist "backend\ai-service\venv" (
    echo Creating Python virtual environment...
    cd backend\ai-service
    python -m venv venv
    cd ..\..
)

REM Install Python dependencies
echo Installing Python dependencies...
cd backend\ai-service
call venv\Scripts\activate
pip install fastapi uvicorn motor python-dotenv openai google-generativeai python-multipart
cd ..\..

REM Start all services
echo.
echo ========================================
echo     Starting Services
echo ========================================
echo.
echo 1. Starting Frontend Apps + API Server...
start "Frontend + API" cmd /k "pnpm dev"

echo 2. Starting AI Service...
timeout /t 3 /nobreak >nul
start "AI Service" cmd /k "cd backend\ai-service && venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

echo.
echo ========================================
echo     Services Starting...
echo ========================================
echo.
echo Patient App:     http://localhost:3000
echo Hospital App:    http://localhost:3001
echo Admin App:       http://localhost:3002
echo API Server:      http://localhost:5000
echo AI Service:      http://localhost:8000
echo.
echo API Health:      http://localhost:5000/health
echo AI Health:       http://localhost:8000/health
echo.
echo Default Login Credentials:
echo Super Admin:     admin@clinicmind.in / Admin@123456
echo Hospital Admin:   admin@apollo.com / Hospital@123
echo.
echo Press any key to open all applications in browser...
pause >nul

REM Open all applications in browser
start http://localhost:3000
start http://localhost:3001
start http://localhost:3002
start http://localhost:5000/health
start http://localhost:8000/health

echo.
echo ========================================
echo     All Services Started Successfully!
echo ========================================
echo.
echo Keep this window open to run all services.
echo Press CTRL+C in individual windows to stop services.
echo.
pause
